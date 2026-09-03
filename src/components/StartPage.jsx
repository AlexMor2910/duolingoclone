import ScrollListFiles from "./ScrollListFiles.jsx";
import {useState} from "react";
import * as XLSX from "xlsx";
import {useNavigate} from "react-router-dom";
import "./StartPage.css";

export default function StartPage(props) {
    const navigate = useNavigate();
    const {excelNames, setExcelNames, excelLength, setExcelLength, buttonState, setButtonState, swapState, setSwapState, inputValues, setInputValues} = props;
    const [total, setTotal] = useState(0);
    const [flagTotal, setFlagTotal] = useState(false);

    function selectFromEachArray(files, buttonStates, inputNumber, swapStates) {
        const selections = [];

        files.forEach((rows, i) => {
            if (!buttonStates[i]) return;

            const data = (rows || []).slice(1).map((row) => swapStates[i] ? [row[1], row[0]] : [row[0], row[1]]).filter((row) => row[0] != null && row[1] != null && String(row[1]).trim() !== "");

            if (data.length === 0) return;

            const wantRaw = Number(inputNumber[i] ?? 0);
            const want = wantRaw > 0 ? Math.min(wantRaw, data.length) : data.length;

            let picked;

            if (want === data.length) {
                picked = data;
            } else {
                const idx = Array.from({length: data.length}, (_, k) => k);

                for (let j = idx.length - 1; j > 0; j--) {
                    const r = Math.floor(Math.random() * (j + 1));
                    [idx[j], idx[r]] = [idx[r], idx[j]];
                }

                picked = idx.slice(0, want).map((k) => data[k]);
            }

            selections.push(...picked);
        });

        for (let i = selections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [selections[i], selections[j]] = [selections[j], selections[i]];
        }

        return selections;
    }

    const handleFiles = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        const loadedFiles = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, {type: "array"});
                    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});
                    resolve({name: file.name.replace(/\.[^/.]+$/, ""), rows});
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        })));

        props.setExcelFiles(loadedFiles.map((file) => file.rows));
        setExcelNames(loadedFiles.map((file) => file.name));
        setExcelLength(loadedFiles.map((file) => Math.max(file.rows.length - 1, 0)));
        setButtonState(Array(loadedFiles.length).fill(false));
        setSwapState(Array(loadedFiles.length).fill(false));
        setInputValues(Array(loadedFiles.length).fill(0));
        setTotal(0);
        setFlagTotal(false);
        event.target.value = "";
    };

    const handleInputChange = (index, value) => {
        setInputValues((prev) => {
            const updated = [...prev];
            updated[index] = Number(value) || 0;
            return updated;
        });
    };

    const getSelectedTotal = () => inputValues.reduce((sum, val, i) => {
        if (!buttonState[i]) return sum;
        const desired = val && val > 0 ? Math.min(val, excelLength[i]) : excelLength[i];
        return sum + desired;
    }, 0);

    const calculateTotal = () => {
        setTotal(getSelectedTotal());
        setFlagTotal(true);
    };

    const buttonRestart = () => {
        setButtonState(Array(excelNames.length).fill(false));
        setSwapState(Array(excelNames.length).fill(false));
        setInputValues(Array(excelNames.length).fill(0));
        setFlagTotal(false);
    };

    const startGame = () => {
        const selectedTotal = getSelectedTotal();

        if (selectedTotal === 0) {
            alert("Please select at least one question.");
            return;
        }

        const selections = selectFromEachArray(props.excelFiles, buttonState, inputValues, swapState);

        if (selections.length === 0) {
            alert("The selected files do not contain usable question-answer rows.");
            return;
        }

        props.setQuestions(selections);
        setTotal(selections.length);
        setFlagTotal(true);
        navigate("/game");
    };

    return (
        <main className="startPage">
            <section className="startCard">
                <header className="startHeader">
                    <p className="startEyebrow">Question setup</p>
                    <h1 className="labelNamePage">Word Order Exercises</h1>
                    <p className="startDescription">Upload one or more Excel files, choose the files to include, optionally swap questions and answers for each file, and set the number of questions for your game. During the game, press the shuffled words to rebuild each answer in the correct order.</p>
                </header>

                <div className="filePickerSection">
                    <input type="file" accept=".xls, .xlsx" onChange={handleFiles} multiple id="fileInput" />
                    <label htmlFor="fileInput" className="fileInputLabel" tabIndex="0">
                        {props.excelFiles.length > 0 ? "Select new files" : "Select files"}
                    </label>
                </div>

                {props.excelFiles.length > 0 && (
                    <div className="configurationPanel">
                        <div className="configurationToolbar">
                            <button onClick={buttonRestart} className="restartButton">Restart calculation</button>
                        </div>

                        <div className="fileTable">
                            <div className="fileTableHeader" aria-hidden="true">
                                <span>Filename</span>
                                <span>Questions</span>
                                <span>Desired</span>
                                <span>Select</span>
                                <span>Inverted</span>
                            </div>
                            <ul className="fileTableList">
                                <ScrollListFiles listNames={excelNames} length={excelLength} buttonState={buttonState} setButtonState={setButtonState} swapState={swapState} setSwapState={setSwapState} inputValues={inputValues} onInputChange={handleInputChange}/>
                            </ul>
                        </div>

                        <div className="totalSection">
                            <button onClick={calculateTotal} className="calculateTotalButton">Calculate total</button>
                            <span className="totalLabel">Total questions <strong className="totalValue">{flagTotal ? total : 0}</strong></span>
                        </div>

                        <button onClick={startGame} className="buttonStartGame">Start game</button>
                    </div>
                )}
            </section>
        </main>
    );
}