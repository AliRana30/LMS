import React , {FC} from 'react'
import { Modal ,Box } from '@mui/material'
import { useTheme } from 'next-themes'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    activeItem: number
    component: any
    setRoute : (route : string) => void
    route?: string
}

const CustomModal: FC<Props> = ({open , setOpen , setRoute, component : Component, route }) => {
  const { theme } = useTheme()

  return (
    <div>
      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        aria-labelledby="modal-modal-title" 
        aria-describedby="modal-modal-description"
        disableAutoFocus
      >
        <Box 
          className="w-full h-full flex items-center justify-center p-4"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-gray-900'
                : 'bg-white'
            }`}
          >
            <Component setOpen={setOpen} setRoute={setRoute} route={route}/>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default CustomModal