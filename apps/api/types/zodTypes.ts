
import { z } from 'zod';


export const authScheam = z.object({
    username : z.string(),
    password : z.string()
})