const calculadora = require("../../models/calculadora.js");
test("testando soma 2 + 2 = 4", () =>{
  const resultado = calculadora.somar(2,2) || calculadora.somar(1, 3);
  expect (resultado).toBe (4);
})

test("testando 5 + 100 = 105", () =>{
  const resultado = calculadora.somar(5,100) || calculadora.somar(59, 46);
  expect (resultado).toBe(105);
})

test("testando string + 100 = Erro", () =>{
  const resultado = calculadora.somar("banana",100) || calculadora.somar(100,"banana");
  expect (resultado).toBe("Erro");
})

test("testando string + 100 = Erro", () =>{
  const resultado = calculadora.subtrair("banana",100) || calculadora.somar(100,"banana");
  expect (resultado).toBe("Erro");
})