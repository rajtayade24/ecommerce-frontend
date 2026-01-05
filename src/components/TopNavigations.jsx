import React from 'react'
import { Link } from 'react-router-dom'

const TopNavigations = () => {
  return (
    <>
      <Link
        to="/products"
        className="text-sm font-medium hover:text-primary transition-colors px-3"
      >
        Products
      </Link >
      <Link
        to="/categories"
        className="text-sm font-medium hover:text-primary transition-colors px-3"
      >
        Categories
      </Link>
      <Link
        to="/about"
        className="text-sm font-medium hover:text-primary transition-colors px-3"
      >
        About
      </Link>
    </>
  )
}

export default TopNavigations
