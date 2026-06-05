Berikut adalah semua diagram dalam format **Mermaid** yang bisa langsung kamu gunakan di Markdown (seperti di GitHub, Notion, atau VS Code dengan plugin Mermaid).

---

## 1. Use Case Diagram

```mermaid
graph TD
    subgraph Sistem Peminjaman Ruangan ITG
        Login((Login))
        CekRuangan((Cek Ketersediaan Ruang))
        Booking((Booking Ruang))
        LihatStatus((Lihat Status Peminjaman))
        CetakBukti((Cetak Bukti))
        Verifikasi((Verifikasi Peminjaman))
        ApprovalKhusus((Approval Khusus))
        KelolaRuang((Kelola Ruang))
        LihatLaporan((Lihat Laporan))
    end

    Mahasiswa --> Login
    Mahasiswa --> CekRuangan
    Mahasiswa --> Booking
    Mahasiswa --> LihatStatus
    Mahasiswa --> CetakBukti

    Dosen --> Login
    Dosen --> CekRuangan
    Dosen --> Booking
    Dosen --> LihatStatus

    AdminRuangan --> Login
    AdminRuangan --> Verifikasi
    AdminRuangan --> KelolaRuang
    AdminRuangan --> LihatLaporan

    Kajur --> Login
    Kajur --> ApprovalKhusus
    Kajur --> LihatLaporan

    Booking -.-> |include| CekRuangan
    Booking -.-> |include| Login
    Verifikasi -.-> |extend| ApprovalKhusus
    CetakBukti -.-> |extend| LihatStatus
```

---

## 2. Activity Diagram (Proses Booking)

```mermaid
flowchart TD
    Start([Mulai]) --> Login[Login ke Sistem]
    Login --> Dashboard[Dashboard User]
    Dashboard --> PilihRuang[Pilih Ruang, Tanggal, Jam]
    PilihRuang --> CekKetersediaan{Cek Ketersediaan}
    
    CekKetersediaan -->|Tidak Tersedia| PilihRuang
    CekKetersediaan -->|Tersedia| IsiForm[Isi Form Peminjaman\nAgenda, Penanggung Jawab]
    
    IsiForm --> Simpan[Simpan Peminjaman\nStatus: PENDING]
    Simpan --> NotifAdmin[Notifikasi ke Admin]
    NotifAdmin --> AdminVerif{Admin Verifikasi}
    
    AdminVerif -->|Data Tidak Valid| Tolak[Tolak Peminjaman]
    Tolak --> NotifTolak[Notifikasi User\nPeminjaman Ditolak]
    NotifTolak --> SelesaiTolak([Selesai])
    
    AdminVerif -->|Valid & Butuh Kajur| KirimKajur[Kirim ke Kajur]
    KirimKajur --> KajurApprove{Kajur Approve?}
    KajurApprove -->|Tolak| Tolak
    KajurApprove -->|Setuju| ACC
    
    AdminVerif -->|Valid & Tidak Butuh Kajur| ACC[Status: DISETUJUI]
    
    ACC --> NotifUser[Notifikasi ke User]
    NotifUser --> Cetak[Cetak Bukti Peminjaman]
    Cetak --> Selesai([Selesai])
```

---

## 3. Sequence Diagram (Booking)

```mermaid
sequenceDiagram
    participant User as Mahasiswa/Dosen
    participant System as Sistem Peminjaman
    participant DB as Database
    participant Admin as Admin Ruangan
    participant Kajur as Kajur

    User->>System: Login (NIM/NIDK + Password)
    System->>DB: Validasi kredensial
    DB-->>System: Data user & role
    System-->>User: Token session

    User->>System: Pilih ruang & waktu
    System->>DB: Cek ketersediaan
    DB-->>System: Status available
    System-->>User: Tampilkan form booking

    User->>System: Submit form (agenda, dll)
    System->>DB: Simpan booking (status PENDING)
    DB-->>System: ID peminjaman
    System->>Admin: Notifikasi (email/dashboard)
    
    Admin->>System: Verifikasi data
    alt Butuh Approval Kajur
        System->>Kajur: Forward ke Kajur
        Kajur->>System: Approve/Reject
        System->>DB: Update status
    else Tidak Butuh Kajur
        System->>DB: Update status jadi DISETUJUI
    end
    
    DB-->>System: Status terupdate
    System-->>User: Notifikasi & bukti peminjaman
```

---

## 4. Class Diagram

```mermaid
classDiagram
    class User {
        +int id_user
        +string nama
        +string email
        +string password
        +enum role
        +string nim_nidk
        +login()
        +logout()
    }

    class Ruangan {
        +int id_ruang
        +string nama_ruang
        +int kapasitas
        +string fasilitas
        +string gedung
        +enum status_ruang
        +getJadwal()
    }

    class Peminjaman {
        +int id_pinjam
        +int id_user
        +int id_ruang
        +datetime tgl_mulai
        +datetime tgl_selesai
        +string agenda
        +enum status
        +string penanggung_jawab
        +submit()
        +cancel()
    }

    class ApprovalLog {
        +int id_approval
        +int id_pinjam
        +string approver_role
        +enum status_approval
        +datetime tgl_approve
        +string catatan
    }

    class Jadwal {
        +int id_jadwal
        +int id_ruang
        +string hari
        +time jam_mulai
        +time jam_selesai
        +boolean is_tersedia
    }

    User "1" -- "many" Peminjaman
    Ruangan "1" -- "many" Peminjaman
    Peminjaman "1" -- "many" ApprovalLog
    Ruangan "1" -- "many" Jadwal
```

---

## 5. DFD Level 0 (Konteks Diagram)

```mermaid
flowchart LR
    subgraph Eksternal
        Mahasiswa[Mahasiswa]
        Dosen[Dosen]
        Admin[Admin Ruangan]
        Kajur[Kajur]
    end

    subgraph Sistem
        Aplikasi[Aplikasi Peminjaman Ruangan ITG]
    end

    Mahasiswa -->|Data peminjaman, login| Aplikasi
    Dosen -->|Data peminjaman, login| Aplikasi
    Admin -->|Verifikasi, kelola ruang| Aplikasi
    Kajur -->|Approval| Aplikasi

    Aplikasi -->|Bukti pinjam, notifikasi| Mahasiswa
    Aplikasi -->|Bukti pinjam, notifikasi| Dosen
    Aplikasi -->|Notifikasi, laporan| Admin
    Aplikasi -->|Notifikasi, laporan| Kajur

    Aplikasi --> DB[(Database)]
    DB --> Aplikasi
```

---

## 6. DFD Level 1

```mermaid
flowchart TD
    subgraph Proses
        P1[1.0 Autentikasi\n& Manajemen User]
        P2[2.0 Kelola Ruangan]
        P3[3.0 Kelola Peminjaman]
        P4[4.0 Verifikasi &\nApproval]
        P5[5.0 Generate\nLaporan & History]
    end

    subgraph DataStore
        D1[(User)]
        D2[(Ruangan)]
        D3[(Peminjaman)]
        D4[(Approval)]
    end

    User -->|Login| P1
    P1 --> D1
    
    Admin -->|CRUD Ruang| P2
    P2 --> D2
    
    User -->|Booking| P3
    P3 --> D3
    P3 -->|Cek| D2
    P3 -->|Notifikasi| P4
    
    P4 --> D4
    P4 -->|Update status| D3
    
    P5 --> D3
    P5 --> D4
    P5 -->|Laporan| Admin
    P5 -->|Laporan| Kajur
```

---

## 7. ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS {
        int id_user PK
        string nama
        string email
        string password
        enum role
        string nim_nidk
    }
    
    RUANGAN {
        int id_ruang PK
        string nama_ruang
        int kapasitas
        string fasilitas
        string gedung
    }
    
    PEMINJAMAN {
        int id_pinjam PK
        int id_user FK
        int id_ruang FK
        datetime tgl_mulai
        datetime tgl_selesai
        string agenda
        enum status
    }
    
    APPROVAL_LOG {
        int id_approval PK
        int id_pinjam FK
        int id_approver FK
        enum status_acc
        datetime tgl_approve
        string catatan
    }
    
    JADWAL {
        int id_jadwal PK
        int id_ruang FK
        string hari
        time jam_mulai
        time jam_selesai
        boolean is_tersedia
    }

    USERS ||--o{ PEMINJAMAN : melakukan
    RUANGAN ||--o{ PEMINJAMAN : digunakan
    PEMINJAMAN ||--o{ APPROVAL_LOG : memiliki
    RUANGAN ||--o{ JADWAL : memiliki
    USERS ||--o{ APPROVAL_LOG : mengapprove
```

---

## 8. Flowchart (Proses Booking)

```mermaid
flowchart TD
    A([Mulai]) --> B[Login]
    B --> C{Login Berhasil?}
    C -->|Tidak| B
    C -->|Ya| D[Tampilkan Dashboard]
    D --> E[Pilih Ruang & Waktu]
    E --> F{Cek Ketersediaan}
    F -->|Tidak Tersedia| E
    F -->|Tersedia| G[Isi Form Peminjaman]
    G --> H[Simpan dengan Status PENDING]
    H --> I[Notifikasi Admin]
    I --> J{Admin Verifikasi}
    
    J -->|Ditolak| K[Notifikasi User: Ditolak]
    K --> L([Selesai])
    
    J -->|Butuh Kajur| M[Forward ke Kajur]
    M --> N{Kajur Approve?}
    N -->|Tolak| K
    N -->|Setuju| O[Status: DISETUJUI]
    
    J -->|Langsung ACC| O
    
    O --> P[Notifikasi User: Disetujui]
    P --> Q[Cetak Bukti Peminjaman]
    Q --> R([Selesai])
```

---

## 9. Flowmap (Alur Dokumen)

```mermaid
flowchart LR
    subgraph User
        MHS[Mahasiswa/Dosen]
    end
    
    subgraph Sistem
        WEB[Sistem Web ITG]
        DB[(Database)]
    end
    
    subgraph Internal
        ADMIN[Admin Ruangan]
        KAJUR[Kajur]
    end
    
    MHS -->|1. Akses Web| WEB
    WEB -->|2. Input Data Booking| DB
    DB -->|3. Notifikasi Pending| ADMIN
    ADMIN -->|4. Verifikasi| WEB
    
    ADMIN -->|5. Jika Butuh Kajur| KAJUR
    KAJUR -->|6. Approval| WEB
    
    WEB -->|7. Update Status| DB
    DB -->|8. Status ACC| WEB
    WEB -->|9. Email Bukti Pinjam| MHS
    
    ADMIN -->|10. Laporan Bulanan| KAJUR
```

---

## 10. Sprint Backlog (Agile) dalam Mermaid

```mermaid
gantt
    title Sprint 1 - 2 Minggu (MVP)
    dateFormat YYYY-MM-DD
    section Sprint 1
    Setup Database & Auth :done, s1_1, 2025-04-01, 2d
    CRUD Ruangan (Admin)  :active, s1_2, 2025-04-03, 2d
    Cek Ketersediaan      :s1_3, 2025-04-05, 2d
    Booking Ruangan       :s1_4, 2025-04-07, 3d
    Dashboard User        :s1_5, 2025-04-10, 2d
    Sprint Review         :milestone, 2025-04-15, 0d

    section Sprint 2
    Verifikasi Admin      :s2_1, 2025-04-16, 2d
    Approval Kajur        :s2_2, 2025-04-18, 2d
    Notifikasi Email      :s2_3, 2025-04-20, 2d
    Cetak Bukti           :s2_4, 2025-04-22, 2d
    Sprint Review         :milestone, 2025-04-30, 0d

    section Sprint 3
    Riwayat & Laporan     :s3_1, 2025-05-01, 3d
    Dashboard Admin & Kajur :s3_2, 2025-05-04, 3d
    UAT & Deployment      :s3_3, 2025-05-07, 3d
    Release               :milestone, 2025-05-10, 0d
```

---

## Cara Menggunakan Mermaid

1. **GitHub**: Langsung tempel di README.md, akan otomatis render.
2. **VS Code**: Install extension "Markdown Preview Mermaid Support".
3. **Online**: Copy-paste ke [Mermaid Live Editor](https://mermaid.live/).

Apakah kamu ingin saya **menggabungkan semua diagram** ke dalam satu file markdown lengkap yang bisa langsung kamu download?