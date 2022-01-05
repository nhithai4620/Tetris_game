document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') //Lấy container grid
    let squares = Array.from(document.querySelectorAll('.grid div')) //Lấy các ô đơn vị
    const scoreDisplay = document.querySelector('#score') // Lấy ô điểm
    const startBtn = document.querySelector('#start-button')
    const resetBtn = document.querySelector('#reset-button') //Lấy nút bắt đầu
    const width = 10 //chiều rộng mỗi row
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
      '#fff700cb',
      'rgba(255,51,85,0.8)',
      'rgba(217,25,255,0.8)',
      'rgb(57,255,20,0.8)',
      'rgba(77,77,255,0.8)'
    ]
    //Khởi tạo và select các thành phần cần thiết
  
    //The Tetrominoes
    // Các khối và các hình dạng khác khi xoay của nó
    const lTetromino = [
      [1, width+1, width*2+1, 2],
      [width, width+1, width+2, width*2+2],
      [1, width+1, width*2+1, width*2],
      [width, width*2, width*2+1, width*2+2]
    ]
    //Chữ L
  
    const zTetromino = [
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1],
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1]
    ]
    //Chữ Z
  
    const tTetromino = [
      [1,width,width+1,width+2],
      [1,width+1,width+2,width*2+1],
      [width,width+1,width+2,width*2+1],
      [1,width,width+1,width*2+1]
    ]
    //Chữ T
  
    const oTetromino = [
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1]
    ]
    //Hình vuông
  
    const iTetromino = [
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3],
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3]
    ]
    //Chữ i
  
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    //Ma trận các khối và dạng xoay của chúng
    let currentPosition = 4  // vị trí rơi hiện tại của khối
    let currentRotation = 0  // xoay tua hình dạng xoay
  
    // console.log(theTetrominoes[0][0])
  
    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length) //Biến random từ 1 tới 5
    let current = theTetrominoes[random][currentRotation]
    // Ô gạch hiện tại theo hình dạng và hình dạng xoay của nó

    //Vẽ ô gạch
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
      })
    }
  
    //Xóa ô gạch
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
  
      })
    }
  
    //Điều khiển
    function control(e) {
      if(e.keyCode === 37) {
        moveLeft() // Gọi hàm sang trái
      } else if (e.keyCode === 38) {
        rotate() // Gọi hàm xoay khi nhấn nút lên
      } else if (e.keyCode === 39) {
        moveRight() // Sang phải
      } else if (e.keyCode === 40) {
        moveDown() // Đi xuống
      }
    }
    document.addEventListener('keyup', control) // thêm sự kiện nhấn nút
  
    //move down function
    function moveDown() {
      undraw() // xóa gạch cũ
      currentPosition += width // gạch rơi bằng cách tăng vị trí lên 1 hàng
      draw() // vẽ gạch mới
      freeze() // dừng gạch khi chạm
    }
  
    //freeze function
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        // Nếu cục gạch rơi xuống mà đụng các ô đã taken thì nó sẽ biến thành taken
        random = nextRandom // gạch đã rơi xong thì, gạch sẽ bằng gạch tiếp theo
        nextRandom = Math.floor(Math.random() * theTetrominoes.length) // gạch ngẫu nhiên sẽ rơi tiếp theo
        current = theTetrominoes[random][currentRotation] //set lại ô gạch mới sẽ rơi
        currentPosition = 4 // set lại vị trí rơi số 4
        draw() // vẽ
        displayShape() // vẽ viên gạch tiếp theo ở ô dự báo
        addScore() // tính điểm
        gameOver() // kết thúc
      }
    }
  
    //Di chuyển gạch sang trái, nếu đụng thì tường hoặc gạch đã taken thì không được
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) //xác định biên trái
      if(!isAtLeftEdge) currentPosition -=1 // di chuyển qua trái
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1 
      }
      draw()
    }
  
    //move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }
  
    
    ///FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
      return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
      return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
      P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
      if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){            //use actual position to check if it's flipped over to right side
          currentPosition += 1    //if so, add one to wrap it back around
          checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }
    
    //rotate the tetromino
    function rotate() {
      undraw()
      currentRotation ++ //thay đổi hình dạng
      if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation] //set hình dạng mới
      checkRotatedPosition()
      draw()
    }
    /////////
  
    
    
    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
  
    //the Tetrominos without rotations
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]
  
    //display the shape in the mini-grid display
    function displayShape() {
      //remove any trace of a tetromino form the entire grid
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }
  
    //add functionality to the button
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
      }
    })

    resetBtn.addEventListener('click', ()=>{
      window.location.reload();
    })
  
    //add score
    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    //game over
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
      }
    }
  
})