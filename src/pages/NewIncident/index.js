import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import api from '../../services/api'
import './styles.css'
import logoImg from '../../assets/logo.svg'

export default function NewIncident() {
  const [incident, setIncident] = useState({
    title: '',
    description: '',
    value: '',
  })
  const ongId = localStorage.getItem('ongId')  
  const history = useHistory()

  function setIncidentAttr(e) {
    setIncident({ ...incident, [e.target.name]: e.target.value})
  }

  async function handleNewIncident(e) {
    e.preventDefault()
    try {
      await api.post('incidents', incident, {
        headers: {
          Authorization: ongId,
        }
      })
      history.push('/profile')
    }
    catch (err) {
      alert(`Erro ao cadastrar caso, tente novamente`)
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="a26hero"/>

          <h1>Cadastrar novo caso</h1>
          <p>Descreva o caso detalhadamente para encontrar um/uma herói/heroína que queira colaborar</p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#e02041"/>
            Voltar para o início
          </Link>
        </section>

        <form onSubmit={handleNewIncident}>
          <input
            name="title"
            onChange={setIncidentAttr}
            placeholder="Título do caso"
          />
          <textarea
            name="description"
            onChange={setIncidentAttr}
            placeholder="Descrição"
          />
          <input
            name="value"
            onChange={setIncidentAttr}
            placeholder="Valor em reais"
          />
          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}