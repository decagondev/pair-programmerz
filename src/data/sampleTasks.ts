/**
 * Sample tasks for room creation
 * 
 * These are hardcoded tasks for Epic 2. In Epic 7, this will be replaced
 * with a Firestore tasks collection and admin CRUD interface.
 */

/**
 * Task interface
 * 
 * Represents a coding task that can be assigned to an interview room.
 */
export interface Task {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // in minutes
  starterCode?: string // Optional starter code
  language: 'typescript' | 'javascript' | 'python' | 'java'
}

/**
 * Sample tasks
 * 
 * Real production bugs and features that candidates can work on.
 */
export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Dark Mode Persistence Bug',
    description:
      'Users report that dark mode preference is not persisting across page refreshes. The theme toggle works, but the setting is lost when the page reloads. Investigate and fix the localStorage implementation.',
    difficulty: 'easy',
    estimatedTime: 20,
    language: 'typescript',
    starterCode: `// Theme context implementation
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  
  return { theme, toggleTheme }
}`,
  },
  {
    id: 'task-2',
    title: 'Pagination Infinite Scroll',
    description:
      'Implement infinite scroll pagination for a product list. When the user scrolls to the bottom, automatically load the next page of products. Handle loading states and prevent duplicate requests.',
    difficulty: 'medium',
    estimatedTime: 45,
    language: 'typescript',
    starterCode: `// Product list component
export function ProductList() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  
  // TODO: Implement infinite scroll
  // TODO: Load more products when scrolling to bottom
  // TODO: Show loading indicator
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}`,
  },
  {
    id: 'task-3',
    title: 'Form Validation Edge Case',
    description:
      'The registration form has a race condition where validation errors can appear after the form is submitted. Fix the validation logic to handle async validation properly and prevent submission during validation.',
    difficulty: 'medium',
    estimatedTime: 30,
    language: 'typescript',
    starterCode: `// Registration form
export function RegistrationForm() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  
  const validateEmail = async (email: string) => {
    // Async validation check
    const exists = await checkEmailExists(email)
    return !exists
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // TODO: Fix validation race condition
    // TODO: Prevent submission during validation
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}`,
  },
  {
    id: 'task-4',
    title: 'Chart Re-render Performance',
    description:
      'A data visualization chart is re-rendering on every state change, even when the chart data hasn\'t changed. Optimize the component to only re-render when the actual chart data changes. Use React.memo and proper dependency arrays.',
    difficulty: 'hard',
    estimatedTime: 60,
    language: 'typescript',
    starterCode: `// Chart component
export function DataChart({ data, options }: ChartProps) {
  // TODO: Optimize re-renders
  // TODO: Only update when data actually changes
  // TODO: Memoize expensive calculations
  
  return <Chart data={data} options={options} />
}`,
  },
  {
    id: 'task-5',
    title: 'Drag & Drop Reordering',
    description:
      'Implement drag and drop reordering for a list of items. Users should be able to drag items to reorder them. The new order should be persisted to the backend. Handle edge cases like dragging to the same position.',
    difficulty: 'hard',
    estimatedTime: 75,
    language: 'typescript',
    starterCode: `// Sortable list component
export function SortableList({ items, onReorder }: SortableListProps) {
  // TODO: Implement drag and drop
  // TODO: Handle reordering logic
  // TODO: Persist new order to backend
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}`,
  },
  {
    id: 'task-6',
    title: 'Auth Redirect Loop',
    description:
      'Users are experiencing an infinite redirect loop when trying to access protected routes. The authentication check is causing the app to redirect between login and the protected route. Fix the redirect logic.',
    difficulty: 'medium',
    estimatedTime: 40,
    language: 'typescript',
    starterCode: `// Auth guard component
export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])
  
  // TODO: Fix redirect loop
  // TODO: Prevent infinite redirects
  
  return user ? children : null
}`,
  },
]

/**
 * Get task by ID
 * 
 * @param taskId - Task ID
 * @returns Task or undefined if not found
 */
export function getTaskById(taskId: string): Task | undefined {
  return sampleTasks.find((task) => task.id === taskId)
}

/**
 * Get all tasks
 * 
 * @returns Array of all tasks
 */
export function getAllTasks(): Task[] {
  return sampleTasks
}

