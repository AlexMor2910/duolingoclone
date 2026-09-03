import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

export default function ResultsPage({ wrongQuestions = [] }) {
    const navigate = useNavigate();
    const location = useLocation();

    const grade = location.state?.grade ?? 0;
    const totalQuestions = location.state?.totalQuestions ?? 0;

    const finishGame = () => {
        const shouldFinish = window.confirm("Do you want to end the game?");

        if (shouldFinish) {
            navigate("/");
        }
    };

    return (
        <main className="resultsPage">
            <section className="resultsCard">
                <header className="resultsHeader">
                    <h1 className="resultsTitle">Results: {grade}/{totalQuestions}</h1>
                </header>

                <section className="reviewSection">
                    <h2 className="reviewTitle">Review:</h2>
                    {wrongQuestions.length === 0 ? (
                        <p className="perfectScoreMessage">
                            Great job! You answered every question correctly.
                        </p>
                    ) : (
                        <ol className="reviewList">
                            {wrongQuestions.map((question, index) => (
                                <li className="reviewItem" key={index}>
                                    <p className="questionText">
                                        <span>Question: </span>
                                        {question[0]}
                                    </p>

                                    <p className="answerText">
                                        <span>Answer: </span>
                                        {question[1]}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                <button type="button" onClick={finishGame} className="endGameResultsButton">
                    Finish
                </button>
            </section>
        </main>
    );
}