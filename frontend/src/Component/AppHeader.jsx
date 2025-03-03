import React from "react";

export default function AppHeader({currentPage, setCurrentPage}) {

  return (
    <>
      <div style={{height: "30px", position: "sticky", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",  background: "#E3F2FD", padding: "15px"}}>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: "20px"}}>
          <p style={{fontSize: "18px", fontWeight: "500", cursor: "pointer", opacity: currentPage==='home' ? "100%" : "50%", transform: currentPage==='home' ? "scale(1.2)" : "scale(1.0)", transition: "all 0.3s ease"}} onClick={() => setCurrentPage('home')}>Speak Buddy</p>
          <p style={{fontSize: "18px", fontWeight: "500", cursor: "pointer", opacity: currentPage==='grammar' ? "100%" : "50%", transform: currentPage==='grammar' ? "scale(1.2)" : "scale(1.0)", transition: "all 0.3s ease"}} onClick={() => setCurrentPage('grammar')}>Check Grammar</p>
          <p style={{fontSize: "18px", fontWeight: "500", cursor: "pointer", opacity: currentPage==='summary' ? "100%" : "50%", transform: currentPage==='summary' ? "scale(1.2)" : "scale(1.0)", transition: "all 0.3s ease"}} onClick={() => setCurrentPage('summary')}>Get Summary</p>
          <p style={{fontSize: "18px", fontWeight: "500", cursor: "pointer", opacity: currentPage==='qa' ? "100%" : "50%", transform: currentPage==='qa' ? "scale(1.2)" : "scale(1.0)", transition: "all 0.3s ease"}} onClick={() => setCurrentPage('qa')}>Ask Questions</p>
        </div>
        <i className="fa-solid fa-bars"></i>
      </div>
    </>
  );
};