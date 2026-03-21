interface SeatMapPickerProps {
    takenSeats: string[];
    selectedSeat: string | null;
    onSeatSelect: (seat: string) => void;
}

const ROWS: { label: string; left: number; right: number }[] = [
    { label: 'G', left: 11, right: 11 },
    { label: 'H', left: 11, right: 11 },
    { label: 'I', left: 12, right: 12 },
    { label: 'J', left: 12, right: 12 },
    { label: 'K', left: 13, right: 13 },
    { label: 'L', left: 11, right: 11 },
];

export const SeatMapPicker = ({ takenSeats, selectedSeat, onSeatSelect }: SeatMapPickerProps) => {
    const takenSet = new Set(takenSeats);

    return (
        <div className="overflow-x-auto">
            <div className="min-w-max space-y-1.5 py-2">
                {ROWS.map(({ label, left, right }) => {
                    // Left block: odd seats descending (e.g. G21, G19, ..., G1) — nearest aisle on right
                    const leftSeats: number[] = [];
                    for (let i = left * 2 - 1; i >= 1; i -= 2) leftSeats.push(i);

                    // Right block: even seats ascending (e.g. G2, G4, ..., G22) — nearest aisle on left
                    const rightSeats: number[] = [];
                    for (let i = 2; i <= right * 2; i += 2) rightSeats.push(i);

                    return (
                        <div key={label} className="flex items-center gap-2">
                            {/* Row label left */}
                            <span className="w-5 text-xs font-bold text-center text-primary-500 dark:text-primary-400 shrink-0">
                                {label}
                            </span>

                            {/* Left block */}
                            <div className="flex gap-1">
                                {leftSeats.map(num => {
                                    const seatId = `${label}${num}`;
                                    const taken = takenSet.has(seatId);
                                    const selected = selectedSeat === seatId;
                                    return (
                                        <SeatButton
                                            key={seatId}
                                            seatId={seatId}
                                            taken={taken}
                                            selected={selected}
                                            onSelect={onSeatSelect}
                                        />
                                    );
                                })}
                            </div>

                            {/* Aisle */}
                            <div className="w-4 shrink-0" />

                            {/* Right block */}
                            <div className="flex gap-1">
                                {rightSeats.map(num => {
                                    const seatId = `${label}${num}`;
                                    const taken = takenSet.has(seatId);
                                    const selected = selectedSeat === seatId;
                                    return (
                                        <SeatButton
                                            key={seatId}
                                            seatId={seatId}
                                            taken={taken}
                                            selected={selected}
                                            onSelect={onSeatSelect}
                                        />
                                    );
                                })}
                            </div>

                            {/* Row label right */}
                            <span className="w-5 text-xs font-bold text-center text-primary-500 dark:text-primary-400 shrink-0">
                                {label}
                            </span>
                        </div>
                    );
                })}

                {/* Stage indicator */}
                <div className="flex justify-center pt-2">
                    <div className="px-8 py-1 rounded bg-primary-200 dark:bg-primary-700 text-xs text-primary-500 dark:text-primary-400 font-medium tracking-widest">
                        STAGE
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SeatButtonProps {
    seatId: string;
    taken: boolean;
    selected: boolean;
    onSelect: (seatId: string) => void;
}

const SeatButton = ({ seatId, taken, selected, onSelect }: SeatButtonProps) => {
    if (taken) {
        return (
            <div
                title={seatId}
                className="w-6 h-6 rounded text-[9px] flex items-center justify-center bg-primary-200 dark:bg-primary-700 text-primary-400 dark:text-primary-500 cursor-not-allowed"
            >
                ✕
            </div>
        );
    }

    return (
        <button
            type="button"
            title={seatId}
            onClick={() => onSelect(seatId)}
            className={`w-6 h-6 rounded text-[9px] font-bold transition-colors ${
                selected
                    ? 'bg-amber-400 dark:bg-amber-500 text-primary-900 ring-2 ring-amber-300 dark:ring-amber-400'
                    : 'bg-teal-500 dark:bg-teal-600 text-white hover:bg-teal-400 dark:hover:bg-teal-500'
            }`}
        >
            {seatId.slice(1)}
        </button>
    );
};
