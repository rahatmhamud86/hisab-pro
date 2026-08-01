import React, { useRef, useState } from "react";

export default function PullToRefresh({ children, onRefresh }) {
    const [pullDistance, setPullDistance] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const startY = useRef(0);
    const pulling = useRef(false);

    const THRESHOLD = 70;

    function handleTouchStart(e) {
        if (window.scrollY === 0 && !refreshing) {
            startY.current = e.touches[0].clientY;
            pulling.current = true;
        }
    }

    function handleTouchMove(e) {
        if (!pulling.current || refreshing) return;
        const diff = e.touches[0].clientY - startY.current;
        if (diff > 0 && window.scrollY === 0) {
            setPullDistance(Math.min(diff * 0.5, 90));
        }
    }

    async function handleTouchEnd() {
        if (!pulling.current) return;
        pulling.current = false;

        if (pullDistance > THRESHOLD) {
            setRefreshing(true);
            setPullDistance(60);
            if (onRefresh) {
                await onRefresh();
            } else {
                window.location.reload();
                return;
            }
            setTimeout(() => {
                setRefreshing(false);
                setPullDistance(0);
            }, 400);
        } else {
            setPullDistance(0);
        }
    }

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="pullIndicator"
                style={{
                    height: pullDistance,
                    opacity: refreshing ? 1 : Math.min(pullDistance / THRESHOLD, 1),
                }}
            >
                <div className={"pullSpinner" + (refreshing ? " spinning" : "")} />
            </div>
            {children}
        </div>
    );
}