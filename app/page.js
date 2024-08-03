'use client'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#333',
  border: '2px solid #ffcc00',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const searchBoxStyle = {
  bgcolor: '#555',  // Grey color for the search box background
  color: '#fff',    // White text color inside the search box
  borderRadius: 1,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)  // Initialize filtered inventory
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on search term
    setFilteredInventory(
      inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      bgcolor={'linear-gradient(135deg, #1e1e1e 0%, #333 100%)'}
      padding={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="#ffcc00">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                input: { color: '#fff' },
                label: { color: '#ffcc00' },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                bgcolor: '#ffcc00',
                color: '#333',
                '&:hover': {
                  bgcolor: '#e6b800',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack width="100%" maxWidth="800px" spacing={2}>
        <Box
          bgcolor={'#000'}
          color={'#ffcc00'}
          padding={2}
          borderRadius={2}
          textAlign={'center'}
          boxShadow={'0 4px 8px rgba(0,0,0,0.5)'}
        >
          <Typography variant={'h4'}>Inventory Items</Typography>
          <TextField
            id="search-bar"
            label="Search Items"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={searchBoxStyle}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{
            bgcolor: '#ffcc00',
            color: '#333',
            '&:hover': {
              bgcolor: '#e6b800',
            },
          }}
        >
          Add New Item
        </Button>
        <Box
          border={'1px solid #555'}
          borderRadius={2}
          padding={2}
          bgcolor={'#444'}
          boxShadow={'0 2px 4px rgba(0,0,0,0.5)'}
        >
          <Stack spacing={2} overflow={'auto'} maxHeight="60vh">
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                bgcolor={'#333'}
                padding={2}
                borderRadius={2}
                boxShadow={'0 1px 3px rgba(0,0,0,0.5)'}
              >
                <Typography variant={'h6'} color={'#ffcc00'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'body1'} color={'#ddd'}>
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => incrementItem(name)}
                    sx={{
                      bgcolor: '#ffcc00',
                      color: '#333',
                      '&:hover': {
                        bgcolor: '#e6b800',
                      },
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    sx={{
                      bgcolor: '#ffcc00',
                      color: '#333',
                      '&:hover': {
                        bgcolor: '#e6b800',
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
