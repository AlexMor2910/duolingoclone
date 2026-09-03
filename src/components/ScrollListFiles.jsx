import "./ScrollListFiles.css";

export default function ScrollListFiles(props) {
    const {listNames, length, buttonState, setButtonState, swapState, setSwapState, inputValues, onInputChange} = props;

    const toggleButton = (index) => {
        setButtonState(prev => prev.map((val, i) => i === index ? !val : val));
    };

    const toggleSwap = (index) => {
        setSwapState(prev => prev.map((val, i) => i === index ? !val : val));
    };

    return (
        <>
            {listNames.map((name, index) => (
                <li className="fileRow" key={`${name}-${index}`}>
                    <span className="fileNameLabelNames" title={name}>{name}</span>
                    <span className="numberQuestionsPerFileLabelNumber">{length[index]}</span>
                    <input type="number" min={0} max={length[index]} value={inputValues[index] || ""} onChange={(e) => onInputChange(index, e.target.value)} className="desiredQuestionsEntry" aria-label={`Desired questions from ${name}`} />

                    <button type="button" onClick={() => toggleButton(index)} className={`selectFileButton ${buttonState[index] ? "active" : "inactive"}`} aria-label={`${buttonState[index] ? "Exclude" : "Include"} ${name}`} aria-pressed={buttonState[index]} />

                    <button type="button" onClick={() => toggleSwap(index)} className={`selectFileButton ${swapState[index] ? "active" : "inactive"}`} aria-label={`${swapState[index] ? "Use normal order for" : "Invert"} ${name}`} aria-pressed={swapState[index]} />
                </li>
            ))}
        </>
    );
}