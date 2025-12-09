import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Position coordinates
 */
export interface Position {
  x: number
  y: number
}

/**
 * Draggable configuration
 */
export interface DraggableConfig {
  /** Initial position */
  initialPosition?: Position
  /** Whether dragging is enabled */
  enabled?: boolean
  /** Boundary constraints (keeps element within these bounds) */
  bounds?: {
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }
}

/**
 * Draggable hook return value
 */
export interface UseDraggableReturn {
  /** Current position */
  position: Position
  /** Whether element is currently being dragged */
  isDragging: boolean
  /** Drag event handlers */
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
  }
  /** Ref to attach to draggable element */
  ref: React.RefObject<HTMLDivElement>
}

/**
 * Draggable hook
 * 
 * Provides drag functionality for elements with mouse and touch support.
 * Handles boundary constraints and position management.
 * 
 * @param config - Draggable configuration
 * @returns Position, drag state, and event handlers
 */
export function useDraggable(config: DraggableConfig = {}): UseDraggableReturn {
  const {
    initialPosition = { x: 0, y: 0 },
    enabled = true,
    bounds,
  } = config

  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<Position | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  /**
   * Constrain position within bounds
   */
  const constrainPosition = useCallback((pos: Position): Position => {
    if (!bounds) return pos

    let { x, y } = pos

    if (bounds.minX !== undefined) x = Math.max(x, bounds.minX)
    if (bounds.maxX !== undefined) x = Math.min(x, bounds.maxX)
    if (bounds.minY !== undefined) y = Math.max(y, bounds.minY)
    if (bounds.maxY !== undefined) y = Math.min(y, bounds.maxY)

    return { x, y }
  }, [bounds])

  /**
   * Handle mouse move
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStartRef.current || !elementRef.current) return

    const newPosition = constrainPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    })

    setPosition(newPosition)
  }, [constrainPosition])

  /**
   * Handle mouse up
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  /**
   * Handle touch move
   */
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragStartRef.current || !elementRef.current || e.touches.length === 0) return

    const touch = e.touches[0]
    const newPosition = constrainPosition({
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y,
    })

    setPosition(newPosition)
  }, [constrainPosition])

  /**
   * Handle touch end
   */
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }, [handleTouchMove])

  /**
   * Handle mouse down
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled || !elementRef.current) return

    e.preventDefault()
    setIsDragging(true)

    const rect = elementRef.current.getBoundingClientRect()
    dragStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [enabled, handleMouseMove, handleMouseUp])

  /**
   * Handle touch start
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || !elementRef.current || e.touches.length === 0) return

    e.preventDefault()
    setIsDragging(true)

    const touch = e.touches[0]
    const rect = elementRef.current.getBoundingClientRect()
    dragStartRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }, [enabled, handleTouchMove, handleTouchEnd])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return {
    position,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
    ref: elementRef as React.RefObject<HTMLDivElement>,
  }
}

