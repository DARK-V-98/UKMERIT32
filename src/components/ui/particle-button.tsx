
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
  rotation: number
}

const createParticle = (x: number, y: number): Particle => {
  return {
    id: Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 3,
    vy: -Math.random() * 2 - 1, // Move upwards
    alpha: 1,
    size: Math.random() * 3 + 1,
    rotation: Math.random() * 360,
  }
}

export const ParticleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const [particles, setParticles] = useState<Particle[]>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newParticles = Array.from({ length: 20 }, () => createParticle(x, y))
      setParticles(newParticles)

      if (onClick) {
        onClick(e)
      }
    }

    const animationFrameRef = useRef<number>()

    const updateParticles = useCallback(() => {
      setParticles((currentParticles) => {
        const updated = currentParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.08, // Gravity
            alpha: p.alpha - 0.02,
          }))
          .filter((p) => p.alpha > 0)
        
        if (updated.length > 0) {
          animationFrameRef.current = requestAnimationFrame(updateParticles)
        }
        
        return updated
      })
    }, [])

    useEffect(() => {
      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(updateParticles)
      }
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [particles, updateParticles])

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-accent"
              style={{
                left: p.x,
                top: p.y,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.alpha,
                transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              }}
            />
          ))}
        </div>
      </Button>
    )
  }
)

ParticleButton.displayName = "ParticleButton"
