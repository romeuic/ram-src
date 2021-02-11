import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import api from '../../services/api'
import './styles.css'

import logoImg from '../../assets/logo.svg'

export default function Register() {
  const [ong, setOng] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    uf: '',
  })

  const history = useHistory()

  function setOngAttr(e) {
    setOng({ ...ong, [e.target.name]: e.target.value})
  }

  async function handleRegister(e) {
    e.preventDefault()
    try {
      const response = await api.post('ongs', ong)
      alert(`Seu ID de acesso: ${response.data.id}`)
      history.push('/')
    }
    catch (err) {
      alert(`Erro no cadastro, tente novamente`)
    }
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="a26hero"/>

          <h1>Cadastro</h1>
          <p>Faça se cadastro, entre na plataforma e ajude pessoas a encontrar os casos da sua ONG</p>

          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#e02041"/>
            Voltar para o logon
          </Link>
        </section>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            value={ong.name}
            onChange={setOngAttr}
            placeholder="Nome da ONG"
          />
          <input
            name="email"
            type="email"
            value={ong.email}
            onChange={setOngAttr}
            placeholder="E-mail"
          />
          <input
            name="whatsapp"
            value={ong.whatsapp}
            onChange={setOngAttr}
            placeholder="WhatsApp"
          />
          <div className="input-group">
            <input
              name="city"
              value={ong.city}
              onChange={setOngAttr}
              placeholder="Cidade"
            />
            <input
              style={{ width: 80 }}
              name="uf"
              onChange={setOngAttr}
              placeholder="UF"
            />
          </div>

          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}