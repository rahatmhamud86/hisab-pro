import React from "react";
import TransactionItem from "./TransactionItem";

export default function TransactionList({ items, onEdit, onDelete, title = "Transactions" }) {
  return (
    <section className="card list">
      <div className="listHead">
        <div className="cardTitle">{title}</div>
        <div className="count">{items.length} items</div>
      </div>

      {items.length === 0 ? (
        <div className="empty">এই রেঞ্জে কোনো হিসাব নাই।</div>
      ) : (
        <div className="items">
          {items.map((t) => (
            <TransactionItem key={t.id} txn={t} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
