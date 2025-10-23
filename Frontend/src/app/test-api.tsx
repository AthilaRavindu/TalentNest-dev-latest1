"use client";

import { useState } from "react";

export default function TestAPI() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult("Testing...");
    
    try {
      console.log("Starting API test...");
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response received:", response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Data received:", data);
      
      setResult(`Success! Received ${data.length} users`);
    } catch (error) {
      console.error("API test failed:", error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h2>API Test</h2>
      <button onClick={testAPI} disabled={loading}>
        {loading ? "Testing..." : "Test API"}
      </button>
      <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f5f5f5" }}>
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
}