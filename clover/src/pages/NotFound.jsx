import React from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import '../styles/Pages.css'

export default function NotFound() {
  return (
    <div className="nf">
      <Seo title="Page not found" />
      <h1>404</h1>
      <p>The page you're looking for has wandered off.</p>
      <Link to="/" className="btn-clover">Back to home</Link>
    </div>
  )
}
