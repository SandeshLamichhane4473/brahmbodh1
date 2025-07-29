// src/extra/AddCategories.js

import React, { useEffect, useState,  useCallback } from 'react';
import {  setDoc, updateDoc,  doc ,getDoc} from 'firebase/firestore';
import { deleteField } from 'firebase/firestore';
 
import { Pencil, Trash2 } from 'lucide-react';
import { db } from '../../../firebase/config';

const AddCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
//  const [editingId, setEditingId] = useState(null);
 const [loading, setLoading] = useState(false);
 const [editingKey, setEditingKey] = useState(null);
   const CATEGORY_DOC_PATH = 'categories/list';
   const categoryRef = doc(db, CATEGORY_DOC_PATH);

const fetchCategories = useCallback(async () => {
  const snap = await getDoc(categoryRef);
  if (snap.exists()) {
    setCategories(snap.data());
  } else {
    setCategories({});
  }
}, [categoryRef]);



  useEffect(() => {
  fetchCategories();
}, [fetchCategories]);



   const handleAdd= async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert('Enter a valid category name');
    const key = trimmed.toLowerCase().replace(/\s+/g, '_');
  try{
        await setDoc(categoryRef, {
        [key]: trimmed
        }, { merge: true });

    setNewCategory('');
    setEditingKey(null);
    fetchCategories();
  }
  catch(e){
    alert(e)
  }
  };


 

  const handleUpdateCategory = async (id) => {
    try{
      setLoading(true)
    const name = newCategory.trim();
    if (!name) return alert('Enter a valid name to update');
    await updateDoc(doc(db, 'categories', 'list'), { [id]:name });
  //  setEditingId(null);
    setEditingKey(null)
    setNewCategory('');
    fetchCategories();
       }catch(e){
        alert(e)
    }
    finally{
      setLoading(false)
    }
  };

  const handleEdit = (key, value) => {
     
    setEditingKey(key)
    setNewCategory(value);
    //setEditingId(key);
  };

  const handleDelete = async (id) => {
    try{
 
    if (window.confirm('Delete this category?')) {
 
          await updateDoc(doc(db, 'categories', 'list'), {
            [id]: deleteField()
          });
      fetchCategories();
    }
}catch(e){
     console.log(e)
        alert(e)
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return (
      <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="flex-1 border px-3 py-2 rounded"
        />
        
        {editingKey}
        <button
          onClick= { editingKey ? ()=>handleUpdateCategory(editingKey) : handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editingKey ? 'Update' : 'Add'}
        </button>
      </div>

      {Object.keys(categories).length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <ul>
          {Object.entries(categories).map(([key, value]) => (
            <li
              key={key}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{value}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(key, value)} className="text-blue-500 hover:text-blue-700">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(key)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddCategories;
