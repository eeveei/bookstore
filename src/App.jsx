import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddBook from './AddBook'
import './App.css'

ModuleRegistry.registerModules([AllCommunityModule])

function App() {
  const [books, setBooks] = useState([])

  const [colDefs, setColDefs] = useState([
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params =>
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    }
  ])

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch('https://bookstore-63cac-default-rtdb.firebaseio.com/books.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-63cac-default-rtdb.firebaseio.com/books.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data)
    const valueKeys = Object.values(data).map((item, index) =>
    Object.defineProperty(item, 'id', {value: keys[index]}))
    setBooks(valueKeys)
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-63cac-default-rtdb.firebaseio.com/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div style={{ height: 500, width: 700 }}>
        <AgGridReact
          rowData={books}
          columnDefs={colDefs}
        />
      </div>
    </>
  )
}

export default App
