import './App.css'
import RouterComponent from './components/RouterComponent.jsx'
import {useState} from "react";

export default function App() {
    const [excelFiles, setExcelFiles] = useState([])
    const [excelNames, setExcelNames] = useState([])
    const [excelLength, setExcelLength] = useState([])
    const [buttonState, setButtonState] = useState([])
    const [swapState, setSwapState] = useState([])
    const [inputValues, setInputValues] = useState([])
    const [questions, setQuestions] = useState([])
    const [wrongQuestions, setWrongQuestions] = useState([]);

    return (
        <RouterComponent excelFiles={excelFiles} setExcelFiles={setExcelFiles} excelNames={excelNames} setExcelNames={setExcelNames} excelLength={excelLength} setExcelLength={setExcelLength} buttonState={buttonState} setButtonState={setButtonState} swapState={swapState} setSwapState={setSwapState} inputValues={inputValues} setInputValues={setInputValues} questions={questions} setQuestions={setQuestions} wrongQuestions={wrongQuestions} setWrongQuestions={setWrongQuestions} />
    )
}
