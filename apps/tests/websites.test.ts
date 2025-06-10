import { describe, expect, it } from "bun:test";
import axios from "axios";

const BASE_URL = 'http://localhost:3000';

describe("website is added in db", () => {
    it("it should failed if url is not passed", async () => {
        try {
            const res = await axios.post(`${BASE_URL}/website`, {})
            
            expect(res.status).toBe(400)
        } catch (error) {
            
        }
    })

     it("it should succeed if url is present", async () => {
        try {
            const res = await axios.post(`${BASE_URL}/website`, {
                url : "https://www.google.com"
            })
            
            expect(res.status).toBe(201)
        } catch (error) {
            
        }
    })


})