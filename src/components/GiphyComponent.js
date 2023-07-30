import React, { useState, useEffect, useRef } from 'react';

import "./GiphyComponent.css"
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataSuccess } from '../actions';


const GiphyComponent = () => {
  const [gifsOrStickers, setGifsOrStickers] = useState('gifs');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  

  const [searchPage, setSearchPage] = useState(1);
  const [trendingPage, setTrendingPage] = useState(1);

  const data = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const loaderRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if(searchTerm===""){
      setIsSearching(false)
    }
  };

  const handleToggle = () => {
    setGifsOrStickers(gifsOrStickers === 'gifs' ? 'stickers' : 'gifs');
    setTrendingPage(1); 
  };


  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setIsSearching(true);
    setSearchPage(1); 
  };

  useEffect(() => {
    const apiKey = 'tNywAWQAO2cv7ma2aAj1HospIMCnUqvJ';
    const limit = 10;
    let apiUrl = '';
    
    if (isSearching && searchTerm) {
      const offset = (searchPage - 1) * limit;
      apiUrl = `https://api.giphy.com/v1/${gifsOrStickers}/search?api_key=${apiKey}&q=${searchTerm}&limit=${limit}&offset=${offset}`;

    } else {
      const offset = (trendingPage - 1) * limit;
      apiUrl = `https://api.giphy.com/v1/${gifsOrStickers}/trending?api_key=${apiKey}&limit=${limit}&offset=${offset}`;
    }


    fetch(apiUrl)
      .then((response) => response.json())
      .then((apiResponse) => {
        if (isSearching && searchPage ===1) {
          dispatch(fetchDataSuccess(apiResponse.data));
        } else if (trendingPage === 1) {
          dispatch(fetchDataSuccess(apiResponse.data));
        } else {
          // If it's not the first page, append new data to the existing data
          dispatch(fetchDataSuccess([...data, ...apiResponse.data]));
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [isSearching, gifsOrStickers, searchPage, trendingPage]);


  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isSearching) {
      setTrendingPage((prevPage) => prevPage + 1);
    }
    else if (target.isIntersecting && isSearching) {
      setSearchPage((prevPage) => prevPage + 1); 
    }
  };

  useEffect(() => {

    const observer = new IntersectionObserver(handleObserver);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // Cleanup observer when component unmounts
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isSearching]);



  return (
    <div className='container'>
      <h1>GIPHY</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter keyword to search GIFs"
        />
        <button className='submit' type="submit">Search</button>
      </form>
      <hr/>
      <button onClick={handleToggle}>
        Switch to {gifsOrStickers === 'gifs' ? 'Stickers' : 'GIFs'}
      </button>
      <hr/>
      <div className='gifContainer'>
        {data.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            alt={gif.title}
            
          />
        ))}
      </div>
      <hr/>
      <div ref={loaderRef} style={{ height: '20px' }}> Loading More Data</div>
    </div>
  );
};

export default GiphyComponent;