
export default class PostModel {
    
    constructor(
        public post: { id: number; image: string; },
        public person: { firstName: string; lastName: string; age?: number; verified: boolean; },
        public location: { country?: string; state?: string | null, city?: string; },
        public stats: { fit: number; not: number; },
        public state : {voted: boolean,fit: boolean} = {voted: false,fit: false}
   
    ) { 
    }
}