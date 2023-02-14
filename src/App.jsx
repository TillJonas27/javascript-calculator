import React from 'react'
import './App.css'

function App() {
  const buttonStyles = " grid place-items-center border border-slate-800 border-collapse text-lg transform hover:opacity-75 active:scale-95"
  // lastInput tracks nothing but the last Input
  const [lastInput, setLastInput] = React.useState("")
  // operation is the whole operation to be worked with
  const [operation, setOperation] = React.useState("")
  // displayInput is reponsible for what is displayed in the calculator
  const [displayInput, setDisplayInput] = React.useState("")
  // afterResult differentiates between the working state of the calculator according
  // to whether we have just received a result or not
  // -> This is crucical because different functionality is required after we just received a result
  const [afterResult, setAfterResult] = React.useState(false)
  // tracks the result -> this could be transformed into an array to track all results
  // and display them as a history of results
  const [result, setResult] = React.useState("")

  function handlingInput(input) {
    // In the first stage we look whether it's an operator (excluding the minus) or a number or minus operator
    if (input === "+" || input === "/" || input === "*") {
      console.log("operator as input")
      // If we just received a result, we reset the lastInput to prevent unwanted behavior.
      // We also set the operation to the result and the input. This allows us to work with the former
      // result in case we've one and the first button pressed is an operator
      if (afterResult) {
          setDisplayInput(input)
          setOperation(result + input)
          setLastInput("")
          setAfterResult(false)
        // Prevent the user from stacking operators on top of each other
        } else if (lastInput !== "+" && lastInput !== "-" && lastInput !== "/" && lastInput !== "*") {
          setLastInput(input)
          setDisplayInput(input)
      }
    } else {
      console.log("number or minus as input")
      // If the user inputs a number after he just received a result, we want to reset it to what the user just put in
      // But we also have to handle the minus operator on this path, so we include it and let it behave the same as the operators above
      if (afterResult) {
        if (input !== "-") {
          setDisplayInput(input)
          setOperation(input)
          setLastInput("")
          setAfterResult(false)
        } else {
          setDisplayInput(input)
          setOperation(result + input)
          setLastInput("")
          setAfterResult(false)
        }
        // Normal working state
        } else {
          // Reset the display when a number is entered after an operator  
            if (lastInput === "/" || lastInput === "*" || lastInput === "+" || lastInput === "-") {
              setLastInput(input)
              setDisplayInput(input)
        } else {
          // Prevent the user from entering several dots 
          if (input === ".") {
            if (lastInput.match(/\./g) === null || lastInput.match(/\./g).length <= 0) {
              setLastInput(input)
              setDisplayInput(old => old + input)
            } 
          // Allow for numbers with more than one digit
          } else {
            setLastInput(input)
            setDisplayInput(old => old + input)
          }
        }
      }
    }
  }
  
  // Any time displayInput is updated and we didnt just receive a result add the lastInput to the operator
  React.useEffect( () => {
    if (!afterResult) {
      setOperation(old => old + lastInput)
    } 
  }, [displayInput])

  // Calculate the result 
  // Handle any errors due to syntax and allow for double minus 
  function calculateResult(operation) {
    try {
      if (operation.match(/(\-){2}/gm)) {
        return eval(operation.replace(/(\-){2}/gm, "+"))
      } else {
        return eval(operation); 
      }
    } catch (e) {
        if (e instanceof SyntaxError) {
            setOperation(e.message);
        }
    }
  }

  // get the result and update the operation and displayInput accordingly
  function getResult() {
    setOperation(old => old + "=" + calculateResult(operation))
    setDisplayInput(calculateResult(operation))
    setResult(calculateResult(operation))
    setAfterResult(true)
  }
  
  function reset() {
    console.log("reset")
    setLastInput("")
    setDisplayInput("")
    setOperation("")
  }
  
  return (
    <main className="bg-slate-900 grid place-items-center w-screen h-screen font-mono">
      <div className="w-96 h-5/6 grid grid-cols-4 grid-rows-6 rounded-md p-2 bg-slate-800 drop-shadow-2xl">
        <div id="display" className="p-2 bg-slate-700 rounded-t-md col-span-4 drop-shadow-2xl">
          <p className="text-2xl text-cyan-300 text-right">{operation}</p>
          <p className="text-3xl text-white text-right">{displayInput}</p>
        </div>
        <button onClick={reset} className={"bg-cyan-400 col-span-2" + buttonStyles}>AC</button>
        <button onClick={() => handlingInput("/")} className={"bg-cyan-700" + buttonStyles}>/</button>
        <button onClick={() => handlingInput("*")} className={"bg-cyan-700" + buttonStyles}>x</button>
        <button onClick={() => handlingInput("7")} className={"bg-slate-100" + buttonStyles}>7</button>
        <button onClick={() => handlingInput("8")} className={"bg-slate-100" + buttonStyles}>8</button>
        <button onClick={() => handlingInput("9")} className={"bg-slate-100" + buttonStyles}>9</button>
        <button onClick={() => handlingInput("-")} className={"bg-cyan-700" + buttonStyles}>-</button>
        <button onClick={() => handlingInput("4")} className={"bg-slate-100" + buttonStyles}>4</button>
        <button onClick={() => handlingInput("5")} className={"bg-slate-100" + buttonStyles}>5</button>
        <button onClick={() => handlingInput("6")} className={"bg-slate-100" + buttonStyles}>6</button>
        <button onClick={() => handlingInput("+")} className={"bg-cyan-700" + buttonStyles}>+</button>
        <button onClick={() => handlingInput("1")} className={"bg-slate-100" + buttonStyles}>1</button>
        <button onClick={() => handlingInput("2")} className={"bg-slate-100" + buttonStyles}>2</button>
        <button onClick={() => handlingInput("3")} className={"bg-slate-100" + buttonStyles}>3</button>
        <button onClick={getResult} className={"bg-slate-400 row-span-2" + buttonStyles}>=</button>
        <button onClick={() => handlingInput("0")} className={"bg-slate-100 col-span-2" + buttonStyles}>0</button>
        <button onClick={() => handlingInput(".")} className={"bg-slate-100" + buttonStyles}>.</button>
      </div>
    </main>
  )
}

export default App

// if (lastInput === "/" || lastInput === "*" || lastInput === "." || lastInput === "+" || lastInput === "-") {
//   console.log("Last input was operator")
//   if (!afterResult) {
//     console.log("Normal behavior")
//     setLastInput(input)
//     setDisplayInput(input)
//   } else if (afterResult) {
//     console.log("Behavior after result")
//     setDisplayInput(input)
//     setOperation(result + input)
//     setLastInput("")
//     setAfterResult(false)
//   }
// } else {
//   console.log("Last input was a number")
//   if (!afterResult) {
//     console.log("Normal behavior")
//     if (input === ".") {
//       console.log(". as input")
//       if (lastInput.match(/\./g) === null || lastInput.match(/\./g).length <= 0) {
//         console.log("no duplicate of .")
//         setLastInput(input)
//         setDisplayInput(old => old + input)
//       } 
//     } else {
//       setLastInput(input)
//       setDisplayInput(old => old + input)
//     }
//   } else if(afterResult) {
//     setDisplayInput(input)
//     setOperation(input)
//     setLastInput("")
//     setAfterResult(false)
//   }
// }