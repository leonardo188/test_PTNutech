"use client"
import router from 'next/router'
import React, { useEffect, useState } from 'react'

interface inputType {
  nama?: string
  tanggal?: string
  NIK?: number
}

export default function home() {
  const [data, setData] = useState<inputType>()
  const [dataArray, setDataArray] = useState<inputType[]>([])
  const [namaImport, setNamaImport] = useState<string[]>([])
  const [mAlertNIK, setmAlertNIK] = useState<string>()
  const [file, setFile] = useState();
  const setInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, [key]: e.target.value })

  const handleSubmit = () => {
    if (data?.NIK && data?.NIK.toString().length <= 9) {
      setmAlertNIK('Min Input 9 digit')
    } else {
      setDataArray([...dataArray, { nama: data?.nama, tanggal: data?.tanggal, NIK: data?.NIK }])
      setmAlertNIK(undefined)
    }
  }

  const exportFile = async () => {
    console.log('clicker')
    const dataString = dataArray
      .map((item) => item.NIK + ',' + item.nama + ',' + item.tanggal)
      .join('\n');
    const blob = new Blob([dataString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "profile.txt";
    link.href = url;
    link.click();
  }

  const handleFile = async () => {
    const doc = file;
    const reader = new FileReader();
    reader.readAsText(doc as any);
    reader.onload = () => {
      const dataArray = reader?.result;
      const a = dataArray?.toString().split("\n")
      const b = a?.map((i) => i.split(",")[1])
      setNamaImport(b as string[])
      console.log(b)
    };
  }

  return (
    <div className="min-h-screen bg-white">
      <div className='flex flex-grow p-8 max-h-screen'>
        <div className='overflow-y-auto grow'>

          <div>
            <div className='flex flex-row items-start'>
              <div className='mr-4'>
                <label> Nama </label>
                <input className='text-black border border-black' value={data?.nama} type="text" onChange={setInput('nama')} />
              </div>
              <div className='mr-4'>
                <label> Tanggal Lahir </label>
                <input className='text-black border border-black' value={data?.tanggal} type="date" onChange={setInput('tanggal')} />
              </div>
              <div className='mr-8'>
                <label> NIK </label>
                <input className='text-black border border-black' value={data?.NIK} type="number" onChange={setInput('NIK')} />
                <div className='text-red-600 text-xs'>{mAlertNIK}</div>
              </div>
              <button className='px-2 border border-black' type="submit" onClick={handleSubmit}>Add</button>
            </div>
          </div>

          <div className='mt-8'>
            {
              dataArray.length > 0 ?
                <div>
                  <div>Hasil</div>
                  {dataArray?.map((i, index) => (
                    <div key={index}>{i.nama + ' | ' + i.tanggal + " | " + i.NIK}</div>
                  ))}

                  <div>
                    <button className='px-2 border border-black mt-4' type="submit" onClick={exportFile}>Export</button>
                  </div>
                </div> :
                null
            }
          </div>

          <div className='mt-20'>
            <div>Deteksi File txt</div>
            <div className='flex flex-row items-center'>
              <input type="file" onChange={(e: any) => setFile(e.target.files[0])} />
              {
                file ? <button className='px-2 border border-black' onClick={handleFile} >Deteksi</button> : undefined
              }
            </div>

            <div>
              {
                namaImport.length > 0 ?
                  <div>
                    <div className='mt-4'>Hasil Import File txt</div>
                    <div>{JSON.stringify(namaImport)}</div>
                  </div> : undefined
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
