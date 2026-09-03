import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "./StartPage.jsx";
import ResultsPage from "./ResultsPage.jsx";
import GamePage from "./GamePage.jsx";
import "./RouterComponent.css";

export default function RouterComponent(props) {
    return (
        <div className="appShell">
            <Routes>
                <Route path="/" element={<StartPage excelFiles={props.excelFiles} setExcelFiles={props.setExcelFiles} excelNames={props.excelNames} setExcelNames={props.setExcelNames} excelLength={props.excelLength} setExcelLength={props.setExcelLength} buttonState={props.buttonState} setButtonState={props.setButtonState} swapState={props.swapState} setSwapState={props.setSwapState} inputValues={props.inputValues} setInputValues={props.setInputValues} questions={props.questions} setQuestions={props.setQuestions} />} />
                <Route path="/game" element={<GamePage questions={props.questions} wrongQuestions={props.wrongQuestions} setWrongQuestions={props.setWrongQuestions} />} />
                <Route path="/results" element={<ResultsPage wrongQuestions={props.wrongQuestions} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}