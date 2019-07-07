import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// React 声明式，高效且灵活构建图形用户界面的JavaScript库
// React元素、React组件、props、state
// 方块，其实每一个Square都渲染了一个单独的Button
// 父组件,子组件,受控组件
// 函数组件、class组件

// NaN not a number     parseInt时给定的字符串不存在数值形式
// Object.assign(target, source),从源枚举属性复制到目标枚举属性
// var newPlayer = Object.assign({}, player, {score: 2}); 
// 不直接修改底层数据 => 不可变性（不可变数据）
function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
//   面板
  class Board extends React.Component {
      renderSquare(i){
        //   在最外层加了一个括号，使得JavaScript解析时候不会在return后面自动插入分号从而破坏代码结构
        //   render用于视图渲染，return用于数据传递
        // return是JavaScript中的语法，将需要用于交互的对象常量也放入return中，相当于get和set方法，并将操作放进来，形成多重return
          return (
            <Square 
                value={this.props.squares[i]}
                // 箭头函数
                onClick={() => this.props.onClick(i)} 
            />
          );
      }
// 一个组件接收一些参数，我们把这些参数叫做props
// 然后通过render方法返回需要展示在屏幕上的视图的展示结构
// 更具体的说，render返回了一个React元素
// 这是一种对于渲染内容的轻量级描述

// 在JSX中你可以任意使用JavaScript表达式，只需要用一个大括号括起来
// 每一个React元素事实上都是一个JavaScript对象
// 你可以在你的程序中把它保存在变量中或者当做参数传递
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
    // 定义含有构造函数的React组件时,需要调用的父类方法
        super(props);
        // 在构造函数中定义了state的取值,用于记忆
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            // 当前查看历史纪录的项
            stepNumber: 0,
            // 当前落子位置
            locationNumber: -1,
            xIsNext: true,
        }
    }
    
    handleClick(i){
        // arrayObject.slice(start,end),从已有数组中返回指定的元素
        // 清空"未来历史记录"
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // 这里是返回squares数组的一个副本
        const squares = current.squares.slice();
        // 已经有玩家胜出或者该格子已经被填充，则不继续做处理
        if(calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // arrayObject.concat(arrayX,arrayX,....,arrayX)用于连接两个或多个数组
            // 且不会改变现有数组，而是返回被连接数组的一个副本
            history: history.concat([{
                squares: squares
            }]),
            // //记录下当前落子位置
            locationNumber : i,
            // 重新渲染行走情况
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // 返回值
    render() {
        const history = this.state.history;
        // 使用最新一次的历史记录来确定并展示游戏的状态
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // 数组的map方法，通常用于把某数组映射为另一数组
        // 在此处map把历史步骤映射为了代表按钮的React元素
        const moves = history.map((step, move) => {
          var i;
          var j;
          // switch(this.state.locationNumber){
          //   case 0: i = 0, j = 0;
          //   break; 
          // }
            const desc = move ?
                'Go to move #' + '(' + i + ',' + j + ')' :
                // 'Go to move #' + this.state.locationNumber : 
                // 'Go to move #' + move : 
                'Go to game start';
            return(
                // React key（当前层级唯一即可） 和 ref，显式指定一个key，用于动态渲染
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        //定义游戏状态栏
        let status;
        if(winner){
            status =   'Winner:' + winner;
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        //若格子被填满且无人获胜，则为平局
        let isTie = false;
        for(let k = 0; k < 9; k++){
          // JS的==具有自适应功能，如123=='123'，1==true都是返回真
            if(current.squares[k] == null){
              isTie = true;
          }
        }
        if(!isTie && !winner){
          status = 'You Tie!';
        }
        
        return(
            <div className="game">
              <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
      );
    }   
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
//   直接传递的实参
  function calculateWinner(squares) {
    //   定义多维数组
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
    //   如果连成一线
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // 胜者"X"或者胜者"O"
        return squares[a];
      }
    }
    return null;
  }