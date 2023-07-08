import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import crypto from "crypto"

const app = express()
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())
const port = process.env.PORT

const USERS = new Map()
USERS.set("VArtz", { id: 1, username: "VArtz", role: "admin" })
USERS.set("John", { id: 2, username: "John", role: "user" })

const SESSION = new Map()

// The main different between authentication and authorization is that authentication is the process of verifying who a user is, while authorization is the process of verifying what they have access to.
// Perbedaan utama antara autentikasi dan otorisasi adalah bahwa autentikasi adalah proses memverifikasi siapa pengguna, sedangkan otorisasi adalah proses memverifikasi apa yang mereka akses.

// Authenticated routes
/** au·then·ti·ca·tion
 * noun
 * the process or action of proving or showing something to be true, genuine, or valid.
 * "the prints will be stamped with his seal and accompanied by a letter of authentication"
 * COMPUTING
 * the process or action of verifying the identity of a user or process.
 * "user authentication for each device ensures that the individual using the device is recognized by the company" */
/** au·then·ti·ca·tion
 * kata benda
 * proses atau tindakan membuktikan atau menunjukkan sesuatu untuk menjadi benar, asli, atau sah.
 * "hasil cetak akan dicap dengan stempelnya dan disertai dengan surat autentikasi"
 * COMPUTING
 * proses atau tindakan verifikasi identitas pengguna atau proses.
 * "otentikasi pengguna untuk setiap perangkat memastikan bahwa orang yang menggunakan perangkat tersebut dikenali oleh perusahaan" */
app.post("/login", (req, res) => {
    const user = USERS.get(req.body.username)
    if (!user) return res.sendStatus(401)

    const sessionId = crypto.randomUUID()
    SESSION.set(sessionId, user)

    res.cookie("sessionId", sessionId, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
    }).send(`Hello ${user.username}`)
})

// Authorized routes
/** au·tho·rize
 * verb
 * give official permission for or approval to (an undertaking or agent).
 * "the court authorized a search"
 * "the use of force was authorized"
 *
 * give someone permission or authority to do something.
 * "a dealer authorized to retail the product"
 * "the trustees are authorized to pay a reasonable sum by way of compensation"
 *
 * (of a government or government agent) provide or secure the legal right to (public funds or a particular territory).
 * "the government authorized the construction of new houses"
 * "the government authorized the use of force"
 *
 * (of a legislature) establish (a measure) by voting for it.
 * "Congress authorized the sale of arms to the rebels"
 * "the Senate authorized a new study of the issue"
 *
 * (of a text) establish the truth or genuineness of (a statement).
 * "the text is authorized in the original version"
 * "the authorized version of the Bible"
 *
 * (of a writer) create or develop (a text) as authorized.
 * "the authorized biography of the composer"
 * "the authorized version of the Bible"
 *
 * (of a computer program, user, etc.) determine whether access is permitted.
 * "the system will not allow you to delete a file unless you are authorized to do so"
 * "the user is authorized to access the database"
 *
 * (of a user) be permitted to access (a computer, database, or other system).
 * "only authorized users can gain access to the system"
 * "the user is authorized to access the database"
 */
/** au·tho·rize
 * kata kerja
 * memberi izin resmi atau persetujuan untuk (usaha atau agen).
 *
 * memberi seseorang izin atau wewenang untuk melakukan sesuatu.
 *
 * (dari pemerintah atau agen pemerintah) menyediakan atau menjamin hak hukum untuk (dana publik atau wilayah tertentu).
 *
 * (dari badan legislatif) menetapkan (langkah) dengan memilihnya.
 *
 * (dari teks) menetapkan kebenaran atau keaslian (pernyataan).
 *
 * (dari penulis) membuat atau mengembangkan (teks) sesuai dengan yang diizinkan.
 *
 * (dari program komputer, pengguna, dll.) menentukan apakah akses diizinkan.
 *
 * (dari pengguna) diizinkan untuk mengakses (komputer, database, atau sistem lainnya).
 *  */
app.get("/admin", (req, res) => {
    const user = SESSION.get(req.cookies.sessionId)
    if (!user) return res.sendStatus(401).send("You are not logged in")
    if (user.role !== "admin") return res.sendStatus(403).send("Unauthorized")

    res.send("Hello admin")
})

// Logout
app.post("/logout", (req, res) => {
    const sessionId = req.cookies.sessionId
    if (!sessionId) return res.sendStatus(400)

    SESSION.delete(sessionId)
    res.clearCookie("sessionId").send("Logged out")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// Path: backend\src\index.ts
// Frontend code is accesible at: frontend\src\App.tsx
