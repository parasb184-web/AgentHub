"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const val = value?.[0] ?? defaultValue?.[0] ?? Number(min);

    const pct = ((val - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="relative w-full py-2">
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[3px] rounded-full"
          style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)", backgroundSize: "8px 3px", backgroundRepeat: "repeat-x" }}
        />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[3px] rounded-full"
          style={{ width: `${pct}%`, backgroundImage: "radial-gradient(circle, rgba(231,76,60,0.7) 1px, transparent 1px)", backgroundSize: "8px 3px", backgroundRepeat: "repeat-x" }}
        />
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => {
            if (onValueChange) {
              onValueChange([parseFloat(e.target.value)]);
            }
          }}
          className={cn(
            "relative z-10 w-full h-2 appearance-none cursor-pointer bg-transparent accent-[#e74c3c]",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
