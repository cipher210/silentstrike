// App.jsx
import React, { useRef, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crosshair,
  Menu,
  Contact,
  Settings,
  Award,
  Zap,
  Telescope as Scope,
  Shield
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const sniper_name = (mainState, shieldState) => {
  console.log(`Sniper function called - Main: ${mainState}, Shield: ${shieldState}`)
  toast.success(`Sniper settings updated! Main: ${mainState}, Shield: ${shieldState}`, {
    style: {
      border: '1px solid #22d3ee',
      padding: '16px',
      background: '#1e293b',
      color: '#fff',
      backdropFilter: 'blur(10px)'
    },
    iconTheme: {
      primary: '#22d3ee',
      secondary: '#fff'
    }
  })
}

const tabs = [
  {
    id: 'aim',
    icon: <Crosshair className="w-6 h-6" />,
    label: 'Aim Menu',
    controls: [
      { id: 'ScanAimbot', label: 'ScanAimbot', type: 'button' },
      { id: 'EnableAimbot', label: 'Enable Aimbot', type: 'button' },
      { id: 'DisableAimbot', label: 'Disable Aimbot', type: 'button' }
    ]
  },
  {
    id: 'sniper',
    icon: <Scope className="w-6 h-6" />,
    label: 'Sniper Scope',
    controls: [{ id: 'Enable', label: 'Enable SniperScope', type: 'button' }],
    label_buttons: [
      {
        id: 'sniper_control',
        buttons: [
          {
            id: 'sniper_main',
            states: ['Disabled', 'Enabled'],
            isActive: 0
          },
          {
            id: 'sniper_shield',
            icon: <Shield className="w-5 h-5 text-white" />,
            isActive: false
          }
        ]
      }
    ]
  },
  {
    id: 'extra',
    icon: <Menu className="w-6 h-6" />,
    label: 'Extra Menu',
    controls: [
      { id: 'fov', label: 'Field of View', type: 'slider', value: 90 },
      { id: 'crosshair', label: 'Custom Crosshair', type: 'checkbox', value: true },
      { id: 'apply', label: 'Apply Changes', type: 'button' }
    ]
  },
  {
    id: 'contact',
    icon: <Contact className="w-6 h-6" />,
    label: 'Contact',
    controls: [
      { id: 'discord', label: 'Join Discord', type: 'button' },
      { id: 'notifications', label: 'Notifications', type: 'checkbox', value: true }
    ]
  },
  {
    id: 'settings',
    icon: <Settings className="w-6 h-6" />,
    label: 'Settings',
    controls: [{ id: 'ConnectToPanel', label: 'connect', type: 'button', value: 75 }]
  },
  {
    id: 'Update',
    icon: <Award className="w-6 h-6" />,
    label: 'Update',
    controls: [
      { id: 'version', label: 'Version: 3.0.0', type: 'button' },
      { id: 'Update', label: 'Check for Updates', type: 'button' }
    ]
  }
]

const TabButton = memo(({ tab, isActive, onClick, index }) => (
  <motion.button
    key={tab.id}
    whileHover={{ scale: 1.01, x: 2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all relative group ${
      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800/50'
    }`}
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.1 + index * 0.05 }}
  >
    {tab.icon}
    <span>{tab.label}</span>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 absolute right-0 rounded-l-full"
      />
    )}
  </motion.button>
))

const LabelButtons = memo(({ buttons, onToggle, onButtonClick }) => (
  <div className="flex flex-col gap-4 mb-8">
    {buttons.map((button) => (
      <div
        key={button.id}
        className="relative group bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative flex items-center justify-between h-full w-full">
          <span className="text-lg font-medium text-cyan-400 mr-4">{button.label}</span>
          {button.type === 'dual_toggle' && (
            <div className="flex gap-4">
              <motion.button
                onClick={() => onToggle('sniper_main')}
                className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${
                  button.buttons[0].isActive === 0
                    ? 'bg-red-500 text-white shadow-red-500/20'
                    : 'bg-green-500 text-white shadow-green-500/20'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {button.buttons[0].states[button.buttons[0].isActive || 0]}
              </motion.button>
              <motion.button
                onClick={() => onToggle('sniper_shield')}
                className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-all ${
                  button.buttons[1].isActive
                    ? 'bg-green-500 text-white shadow-green-500/20'
                    : 'bg-red-500 text-white shadow-red-500/20'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  {button.buttons[1].icon}
                  <span>{button.buttons[1].isActive ? 'Enabled' : 'Disabled'}</span>
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
))

const Control = memo(({ control, tabId, onUpdate, onButtonClick }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
    <div className="relative bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-medium text-cyan-400 min-w-[120px] mr-8">
          {control.label}
        </label>
        {control.type === 'button' && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (control.onClick) {
                control.onClick()
              }
              onButtonClick(control.label)
            }}
            className="min-w-[120px] px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-medium text-white shadow-lg shadow-cyan-500/20 transition-all"
          >
            {control.label}
          </motion.button>
        )}
      </div>

      {control.type === 'slider' && (
        <div className="relative pt-8">
          <input
            type="range"
            min="0"
            max="100"
            value={control.value}
            onChange={(e) => onUpdate(tabId, control.id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <motion.div
            className="absolute -top-2 text-cyan-400 font-mono bg-gray-900/90 px-2 py-1 rounded-md border border-cyan-500/20"
            style={{ left: `${control.value}%` }}
            initial={false}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {control.value}%
          </motion.div>
        </div>
      )}

      {control.type === 'checkbox' && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={control.value}
            onChange={(e) => onUpdate(tabId, control.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500" />
        </label>
      )}
    </div>
  </motion.div>
))

function App() {
  const [ws, setWs] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('aim')
  const [controls, setControls] = useState(tabs.map((tab) => ({ id: tab.id, controls: tab.controls })))
  const [labelButtons, setLabelButtons] = useState(
    tabs.map((tab) => ({ id: tab.id, buttons: tab.label_buttons || [] }))
  )

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault()
      if (username === '1' && password === '1') {
        setIsLoggedIn(true)
      }
    },
    [username, password]
  )

  const updateControlValue = useCallback((tabId, controlId, value) => {
    setControls((prevControls) =>
      prevControls.map((tab) => {
        if (tab.id === tabId) {
          return {
            ...tab,
            controls: tab.controls.map((control) => (control.id === controlId ? { ...control, value } : control))
          }
        }
        return tab
      })
    )
  }, [])

  const handleToggle = useCallback((buttonId) => {
    setLabelButtons((prevButtons) => {
      return prevButtons.map((tab) => {
        if (tab.id === 'sniper') {
          return {
            ...tab,
            buttons: tab.buttons.map((button) => {
              if (button.id === 'sniper_control') {
                const updatedButtons = button.buttons.map((btn) => {
                  if (btn.id === buttonId) {
                    if (btn.id === 'sniper_main') {
                      const nextState = ((btn.isActive || 0) + 1) % btn.states.length
                      const mainState = btn.states[nextState]
                      const shieldState = button.buttons[1].isActive ? 'Enabled' : 'Disabled'
                      sniper_name(mainState, shieldState)
                      return { ...btn, isActive: nextState }
                    } else if (btn.id === 'sniper_shield') {
                      const newState = !btn.isActive
                      const mainState = button.buttons[0].states[button.buttons[0].isActive || 0]
                      const shieldState = newState ? 'Enabled' : 'Disabled'
                      sniper_name(mainState, shieldState)
                      return { ...btn, isActive: newState }
                    }
                  }
                  return btn
                })
                return { ...button, buttons: updatedButtons }
              }
              return button
            })
          }
        }
        return tab
      })
    })
  }, [])

  const wsRef = useRef(null)
const handleButtonClick = useCallback(
  async (label) => {
    if (label === 'connect') {
      const socket = new WebSocket('ws://192.168.0.107:24124')

      socket.onopen = () => {
        setWs(socket)
        
        console.log('WebSocket connected')
        ws.send("connect")
      }
      socket.onclose = () => {
        setWs(null)
        console.log('WebSocket disconnected')
      }
      socket.onerror = (err) => {
        setWs(null)
        console.log('WebSocket error')
      }
    } else {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(label)
        console.log(`Sent message: ${label}`)
      } else {
        console.log('WebSocket is not connected')
      }
    }
  },
  [ws]
)



  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black text-white flex items-center justify-center p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-xl opacity-20" />
          <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20">
            <motion.div className="flex items-center gap-2 mb-8 justify-center" initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SilentStrike V1
              </h1>
            </motion.div>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium mb-2 text-cyan-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700/50 backdrop-blur rounded-lg p-3 text-white border border-cyan-500/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                />
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <label className="block text-sm font-medium mb-2 text-cyan-400">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 backdrop-blur rounded-lg p-3 text-white border border-cyan-500/20 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all"
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-medium text-white shadow-lg shadow-cyan-500/20 transition-all"
                type="submit"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Login
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab)
  const activeControls = controls.find((tab) => tab.id === activeTab)?.controls || []
  const activeButtons = labelButtons.find((tab) => tab.id === activeTab)?.buttons || []

  return (
    <div className="h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black text-white flex">
      <Toaster position="top-right" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full bg-gray-800/50 backdrop-blur-xl flex">
        <div className="w-64 bg-gray-900/50 backdrop-blur-xl p-4 border-r border-cyan-500/20">
          <motion.div className="flex items-center gap-2 mb-8 p-4" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SilentStrike Panel
            </h1>
          </motion.div>
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} index={index} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <motion.h2 initial={{ x: -20 }} animate={{ x: 0 }} className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
                {activeTabData?.label}
              </motion.h2>
              {activeButtons.length > 0 && (
                <LabelButtons buttons={activeButtons} onToggle={handleToggle} onButtonClick={handleButtonClick} />
              )}
              {activeControls.map((control, index) => (
                <Control key={control.id} control={control} tabId={activeTab} onUpdate={updateControlValue} onButtonClick={handleButtonClick} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default App
