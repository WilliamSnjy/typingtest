import React, { useState, useEffect } from "react";

const wordList = [
    'saya', 'kamu', 'mereka', 'kita', 'pergi', 'makan', 'minum', 'belajar',
    'buku', 'komputer', 'jalan', 'rumah', 'kantor', 'teknologi', 'bahasa',
    'waktu', 'kerja', 'cepat', 'lambat', 'tulis', 'duduk', 'bermain', 'koding'
];

function generateRandomText(wordList, wordCount = 12) {
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, wordCount).join(" ");
}

const TIME_LIMIT = 60;

function TypingTest() {
    const [inputText, setInputText] = useState("");
    const [randomText, setRandomText] = useState(generateRandomText(wordList));
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setIsFinished(true);
            setIsRunning(false);
            setEndTime(Date.now());
        }
        return () => clearTimeout(timer);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (isFinished && startTime && endTime) {
            const timeTakenInMinutes = (endTime - startTime) / 1000 / 60;
            const wordCount = randomText.trim().split(/\s+/).length;
            const calculatedWpm = Math.round(wordCount / timeTakenInMinutes);
            setWpm(calculatedWpm);
        }
    }, [isFinished, startTime, endTime]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputText(value);
    
        if (!isRunning) {
            setIsRunning(true);
            setStartTime(Date.now());
        }
    
        // Normalisasi kedua teks untuk menghindari kesalahan sepele
        const normalize = str => str.trim().replace(/\s+/g, ' ').toLowerCase();
    
        if (normalize(value) === normalize(randomText)) {
            setIsFinished(true);
            setIsRunning(false);
            setEndTime(Date.now());
        }
    };

    const resetTest = () => {
        setRandomText(generateRandomText(wordList));
        setInputText("");
        setStartTime(null);
        setEndTime(null);
        setIsFinished(false);
        setWpm(0);
        setTimeLeft(TIME_LIMIT);
        setIsRunning(false);
    };

    return (
        <>
            <h1>TYPING TEST</h1>
            <h2>{randomText}</h2>
            <div><strong>Waktu tersisa: {timeLeft} detik</strong></div>
            <div style={{ margin: "10px 0" }}>
                <input 
                    type="text" 
                    placeholder="ketik disini untuk memulai"
                    style={{ width: '300px' }}
                    value={inputText}
                    onChange={handleChange}
                    disabled={isFinished || timeLeft === 0}
                />
            </div>

            {isFinished && (
                <div>
                    <h3>Selesai!</h3>
                    <p>Waktu: {((endTime - startTime) / 1000).toFixed(2)} detik</p>
                    <p>Kecepatan: {wpm} kata per menit</p>
                </div>
            )}

            <button onClick={resetTest}>Reset Test</button>
        </>
    );
}

export default TypingTest;
