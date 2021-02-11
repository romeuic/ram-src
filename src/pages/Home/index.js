import { useEffect, useState } from 'react'
import api from '../../services/api'
import logo from '../../assets/ram-logo.png'
import background from '../../assets/background.png'
import loaderImg from '../../assets/loadBg.png'
import './style.css'

function Home() {

  const [search, setSearch] = useState({ name: '' })
  const [results, setResults] = useState({})
  const [pagination, setPagination] = useState({ pages: 0, current: 0 })
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log('RESULTS', results)

    setPagination({
      ...pagination,
      pages: results?.data?.characters?.info?.pages || 0,
    })

  }, [results])

  useEffect(() => {
    console.log('PAGINATION', pagination)
  }, [pagination])

  function setSearchAttr(e) {
    setSearch({ [e.target.name]: e.target.value})
  }

  async function handleSearch(e, p = 0) {
    if (e) {
      e.preventDefault()
      setPagination({ ...pagination, current: 0 })
    }
    setIsLoading(true)
    console.log('GO_TO_PAGE', p)
    try {
      const { data } = await api.post(
        'graphql',
        { 
          query: `
            query {
              characters(page: ${p}, filter: { name: "${search.name}" }) {
                info { count, pages }
                results {
                  id,
                  name,
                  species,
                  image,
                  gender,
                  status,
                  origin { name },
                  location { name }
                }
              }
            }
          `,
          variables: {}
        },
        { headers: { 'Content-Type': 'application/json'} }
      )
      setResults(data || {})
      setIsLoading(false)
    } catch (err) {
      alert('Falha na requisição, tente novamente')
    }
  }

  const showDetails = c => {
    console.log('DETAILS', c)
    setDetails(c)
  }

  const renderDetails = () => {
    if (details) {
      return (
        <div className="details-container">
          <div className="details-box">
            
            <div
              className="profile" 
              style={{ backgroundImage: `url(${details.image})` }}
            >
            </div>

            <div className="about">
              <div className="title">ABOUT</div>
              <p style={{ margin: 8 }}>to</p>
              <p>change</p>
            </div>

            <button className="close-btn" onClick={() => setDetails(null)}>Close</button>
          </div>
        </div>
      )
    }
    return null
  }

  const changePage = p => {
    setPagination({
      ...pagination,
      current: p - 1
    })
    handleSearch(null, p)
  }

  const renderPagination = () => {
    if (pagination?.pages) {
      const pgBnts = []
      let count = 0

      const pgPush = i => {
        pgBnts.push(
          <div
            key={i}
            className={i === pagination.current ? 'active' : ''}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </div>
        )
      }

      if (pagination.pages <= 5 || pagination.current < 2) {
        for (let i = 0; i < pagination.pages && count < 5; i++) {
          pgPush(i)
          count++
        }
      } else if (pagination.current > pagination.pages - 3) {
        for (let i = pagination.pages - 5; i < pagination.pages; i++) {
          pgPush(i)
        }
      } else {
        for (let i = pagination.current - 2; i < pagination.pages && count < 5; i++) {
          if (i - 5 < pagination.current && pagination.current < i + 5) {
            pgPush(i)
            count++
          }
        }
      }

      return (
        <div className="pagination">
          {pgBnts}
        </div>
      )
    }
    return null
  }

  const renderResults = () => {
    if (results?.data?.characters?.results?.length) {
      return (
        <div>
          <ul className="results">
          {
            results.data.characters.results.map(c => (
              <li
                key={c.id}
                onClick={() => showDetails(c)}
                className={c.status}
              >
                <img src={c.image} alt={c.name} />
                <div>
                  <h1>{c.name}</h1>
                  <p>{c.species}</p>
                </div>
              </li>
            ))
          }
          </ul>
          {renderPagination()}
        </div>
      )
    }
    return null
  }

  return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <form onSubmit={handleSearch}>
          <input
              name="name"
              value={search.name}
              onChange={setSearchAttr}
              placeholder="Search characters"
            />
          <button className="button" type="submit">Search</button>
        </form>
      </header>
      {renderResults()}
      {renderDetails()}

      <div
        className="loading-container"
        style={!isLoading ? { opacity: 0, pointerEvents: 'none' } : {}}
      >
        <img src={loaderImg} alt="" />
        <p>Loading</p>
      </div>
    </div>
  )
}

export default Home
