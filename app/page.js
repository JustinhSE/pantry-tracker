"use client";
import { Box, TextField, Typography, Stack, IconButton, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { collection, getDocs, query, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function SearchHistory() {
  const [pantry, setPantry] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRemoveItem = async (id) => {
    const docRef = doc(firestore, "pantry", id);
    await deleteDoc(docRef);
    updatePantry();
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { quantity: newQuantity });
    updatePantry();
  };

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (filteredPantry.length === 0) {
      alert("Item not found in pantry");
      setSearchTerm("");
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <TextField
        label="Search Pantry"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ marginBottom: 2 }}
      />
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="500px" spacing={2} overflow={"auto"}>
          {filteredPantry.map((item) => (
            <Box
              key={item.id}
              width="100%"
              height="100px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              px={2}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  -
                </IconButton>
                <Typography variant={"h5"}>{item.quantity}</Typography>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </IconButton>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
