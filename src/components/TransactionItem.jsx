import React from "react";
import { formatDateTime, formatAmount } from "../utils/formatters";
import { getCategoryIcon } from "../utils/categories";
import { useAppContext } from "../context/AppContext";

export default function TransactionItem({ txn, onEdit, onDelete }) {
  const { currencySymbol } = useAppContext();
  const isIncome = txn.type === "income";

  return (
    <div className="item">
      <div className={"badge " + (isIncome ? "bIn" : "bOut")}>{isIncome ? "IN" : "OUT"}</div>
      <div className="itemMain">
        <div className="itemTop">
          <div className="itemAmount">{formatAmount(txn.amount, currencySymbol)}</div>
          <div className="itemTime">{formatDateTime(txn.date)}</div>
        </div>
        <div className="itemNote">
          {getCategoryIcon(txn.category)} {txn.category}
          {txn.note ? ` — ${txn.note}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button className="iconBtn" onClick={() => onEdit(txn)}>
          Edit
        </button>
        <button className="iconBtn" onClick={() => onDelete(txn.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
