const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default API_URL
```

Crée **`vote-electronique/.env.production`** :
```
VITE_API_URL=https://votesecure-sn.onrender.com