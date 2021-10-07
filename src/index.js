import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Sobre from './Pages/Sobre';
import Acompanhar from './Pages/Acompanhar';
import Importacao from './Pages/Importacao';
import Imprimir from './Pages/Imprimir';
import Configuracoes from './Pages/Configuracoes';
import ConfiguracoesBD from './configuracoesBD.js';

ReactDOM.render(
  <>
    <ConfiguracoesBD />
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={Acompanhar} />
        <Route path="/importar" component={Importacao} />
        <Route path="/acompanhar" component={Acompanhar} />
        <Route path="/imprimir" component={Imprimir} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route path="*" component={Acompanhar} />
      </Switch>
    </ BrowserRouter>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
