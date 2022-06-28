import { Card, CardContent, Typography } from "@mui/material"
import React from "react"

const App: React.FC = () => {
  return (
    <Card sx={{ maxWidth: 275 }}>
      <CardContent>
        <Typography 
          variant="h1"
        >
          Hello World
        </Typography>
      </CardContent>
    </Card>
  )
}

export default App
