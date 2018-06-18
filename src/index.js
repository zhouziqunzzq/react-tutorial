import React from 'react';
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button
            className={props.highlight ? "square square-highlight" : "square"}
            onClick={props.onClick}
        >{props.value}</button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                highlight={this.props.highlights[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const maxRow = 3;
        const maxColumn = 3;
        const squares = [...Array(maxRow).keys()].map(row => {
            const aRow = [...Array(maxColumn).keys()]
                .map(i => i + row * 3)
                .map(i => {
                    return this.renderSquare(i);
                });
            return (
                <div
                    key={row}
                    className="board-row"
                >{aRow}</div>
            );
        });
        return (
            <div>{squares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                highlights: Array(9).fill(false),
                lastMove: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            showHistoryReverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const highlights = current.highlights.slice();

        let [winner] = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let [, winningLines] = calculateWinner(squares);
        if (winningLines) {
            for (let l of winningLines) {
                highlights[l] = true;
            }
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                highlights: highlights,
                lastMove: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleHistoryReverseClick() {
        this.setState({
            showHistoryReverse: !this.state.showHistoryReverse,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner] = calculateWinner(current.squares);
        const isFull = calculateFull(current.squares);
        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' (' + (Math.floor(step.lastMove / 3) + 1) +
                ',' + (Math.floor(step.lastMove % 3) + 1) + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        className={this.state.stepNumber === move ? 'btn-selected' : ''}
                    >{desc}</button>
                </li>
            );
        });
        if (this.state.showHistoryReverse) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (isFull) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const btnReverseMsg = this.state.showHistoryReverse ?
            'Show history in desc' :
            'Show history in asc';

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        highlights={current.highlights}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <button
                        onClick={() => this.handleHistoryReverseClick()}
                    >{btnReverseMsg}</button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, null];
}

function calculateFull(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            return false;
        }
    }
    return true;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
