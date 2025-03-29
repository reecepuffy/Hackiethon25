import React, { useState, useEffect, useRef } from 'react';
import './timer.css';

const MyWidget = () => {
  const [totalPoints, setTotalPoints] = useState(0);

  // const is used when you know the variable should not and therefore cannot be changed.
  const DigitalTimer = () => {
    const initialState = {
      isTimerRunning: false,
      timeElapsedInSeconds: 0,
      timerLimitInMinutes: 25,
      sessionCompleted: false
    };

    const [state, setState] = useState(initialState);
    const { isTimerRunning, timeElapsedInSeconds, timerLimitInMinutes, sessionCompleted } = state;
    
    const intervalIdRef = useRef(null); // continue interval ID across renders

    // Calculate points based on timer duration
    const calculatePoints = (minutes) => {
      // Basic formula: 2 points per minute of completed study
      return minutes * 2;
    };

    useEffect(() => {
      if (isTimerRunning) {
        intervalIdRef.current = setInterval(() => {
          setState((prevState) => {
            const isTimerCompleted = prevState.timeElapsedInSeconds === prevState.timerLimitInMinutes * 60;
            
            if (isTimerCompleted && !prevState.sessionCompleted) {
              clearInterval(intervalIdRef.current);
              // Award points when timer completes
              const pointsEarned = calculatePoints(prevState.timerLimitInMinutes);
              setTotalPoints(prevPoints => prevPoints + pointsEarned);
              return { 
                ...prevState, 
                isTimerRunning: false,
                sessionCompleted: true 
              };
            }

            return { ...prevState, timeElapsedInSeconds: prevState.timeElapsedInSeconds + 1 };
          });
        }, 1000);
      } else {
        clearInterval(intervalIdRef.current); // Ensure interval stops when paused
      }

      return () => clearInterval(intervalIdRef.current); // Cleanup on unmount
    }, [isTimerRunning]); // Runs when `isTimerRunning` changes

    // decreasing the amount of time in the timer
    const onDecreaseTimerLimitInMinutes = () => {
      if (timerLimitInMinutes > 1) {
        setState((prevState) => ({
          ...prevState,
          timerLimitInMinutes: prevState.timerLimitInMinutes - 1,
        }));
      }
    };

    const onIncreaseTimerLimitInMinutes = () => {
      // no need for any if statement, the timer can increment forever (impractical but whatever)
      setState((prevState) => ({
        ...prevState,
        timerLimitInMinutes: prevState.timerLimitInMinutes + 1,
      }));
    };

    const onStartOrPauseTimer = () => {
      if (timeElapsedInSeconds === timerLimitInMinutes * 60) {
        setState({ ...initialState });
      }

      setState((prevState) => ({
        ...prevState,
        isTimerRunning: !prevState.isTimerRunning,
      }));
    };

    const onResetTimer = () => {
      clearInterval(intervalIdRef.current);
      setState(initialState); // Fixed: should reset to initialState, not prevState
    };

    const getElapsedSecondsInTimeFormat = () => {
      const totalRemainingSeconds = timerLimitInMinutes * 60 - timeElapsedInSeconds;
      const minutes = Math.floor(totalRemainingSeconds / 60);
      const seconds = Math.floor(totalRemainingSeconds % 60);
      const stringifiedMinutes = minutes > 9 ? minutes : `0${minutes}`;
      const stringifiedSeconds = seconds > 9 ? seconds : `0${seconds}`;
      return `${stringifiedMinutes}:${stringifiedSeconds}`;
    };

    const renderTimerLimitController = () => {
      const isButtonsDisabled = timeElapsedInSeconds > 0;
      return (
        <div className="timer-limit-controller-container">
          <p className="limit-label">Set Timer limit</p>
          <div className="timer-limit-controller">
            <button
              className="limit-controller-button"
              disabled={isButtonsDisabled}
              onClick={onDecreaseTimerLimitInMinutes}
              type="button"
            >
              -
            </button>
            <div className="limit-label-and-value-container">
              <p className="limit-value">{timerLimitInMinutes}</p>
            </div>
            <button
              className="limit-controller-button"
              disabled={isButtonsDisabled}
              onClick={onIncreaseTimerLimitInMinutes}
              type="button"
            >
              +
            </button>
          </div>
        </div>
      );
    };

    const renderTimerController = () => {
      const startOrPauseImageUrl = isTimerRunning
        ? 'https://assets.ccbp.in/frontend/react-js/pause-icon-img.png'
        : 'https://assets.ccbp.in/frontend/react-js/play-icon-img.png';
      const startOrPauseAltText = isTimerRunning ? 'pause icon' : 'play icon';

      return (
        <div className="timer-controller-container">
          <button
            className="timer-controller-btn"
            onClick={onStartOrPauseTimer}
            type="button"
          >
            <img
              alt={startOrPauseAltText}
              className="timer-controller-icon"
              src={startOrPauseImageUrl}
            />
            <p className="timer-controller-label">
              {isTimerRunning ? 'Pause' : 'Start'}
            </p>
          </button>
          <button
            className="timer-controller-btn"
            onClick={onResetTimer}
            type="button"
          >
            <img
              alt="reset icon"
              className="timer-controller-icon"
              src="https://assets.ccbp.in/frontend/react-js/reset-icon-img.png"
            />
            <p className="timer-controller-label">Reset</p>
          </button>
        </div>
      );
    };

    // Display a message when timer completes
    const renderCompletionMessage = () => {
      if (sessionCompleted) {
        const pointsEarned = calculatePoints(timerLimitInMinutes);
        return (
          <div className="completion-message" style={{ color: 'green', marginTop: '10px', fontWeight: 'bold' }}>
            🎉 You earned {pointsEarned} points!
          </div>
        );
      }
      return null;
    };

    // Component render
    return (
      <div className="digital-timer-container">
        <div className="timer-display-container">
          <div className="elapsed-time-container">
            <h1 className="elapsed-time">{getElapsedSecondsInTimeFormat()}</h1>
            <p className="timer-state">{isTimerRunning ? 'Running' : 'Paused'}</p>
            {renderCompletionMessage()}
          </div>
        </div>
        <div className="controls-container">
          {renderTimerController()}
          {renderTimerLimitController()}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <div className="text-center space-y-4">
        <div className="points-display text-lg font-bold bg-green-100 py-2 px-4 rounded-lg inline-block">
          <span>Total Points: {totalPoints}</span>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold">Study Timer</h3>
          <DigitalTimer />
        </div>
      </div>
    </div>
  );
};

export default MyWidget;