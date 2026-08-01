import React from "react";

export function SkeletonBox({ height = 20, width = "100%", radius = 8, style = {} }) {
    return (
        <div
            className="skeletonBox"
            style={{ height, width, borderRadius: radius, ...style }}
        />
    );
}

export function SkeletonBalanceCard() {
    return (
        <div className="card">
            <SkeletonBox height={14} width="40%" style={{ marginBottom: 10 }} />
            <SkeletonBox height={32} width="60%" style={{ marginBottom: 14 }} />
            <div className="row" style={{ gap: 10 }}>
                <SkeletonBox height={60} style={{ flex: 1 }} />
                <SkeletonBox height={60} style={{ flex: 1 }} />
                <SkeletonBox height={60} style={{ flex: 1 }} />
            </div>
        </div>
    );
}

export function SkeletonChartCard() {
    return (
        <div className="card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 220 }}>
            <SkeletonBox height={180} width={180} radius={999} />
        </div>
    );
}

export function SkeletonTransactionList({ rows = 5 }) {
    return (
        <div className="card">
            <SkeletonBox height={16} width="30%" style={{ marginBottom: 16 }} />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="row" style={{ gap: 10, marginBottom: 14, alignItems: "center" }}>
                    <SkeletonBox height={40} width={40} radius={12} />
                    <div style={{ flex: 1 }}>
                        <SkeletonBox height={14} width="60%" style={{ marginBottom: 6 }} />
                        <SkeletonBox height={11} width="35%" />
                    </div>
                    <SkeletonBox height={16} width={60} />
                </div>
            ))}
        </div>
    );
}