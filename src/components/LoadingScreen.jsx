import React from "react";

export default function LoadingScreen() {
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card glass" style={{ padding: 24, textAlign: "center" }}>
        <div className="logo" style={{ margin: "0 auto 10px" }}>৳</div>
        <div className="subTitle">লোড হচ্ছে...</div>
      </div>
    </div>
  );
}
