import { Paciente } from "@/types";
import Cookies from "js-cookie";
// ... imports anteriores
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export async function getMyAppointments() {
  const token = Cookies.get('token');
  if (!token) throw new Error('No hay sesión activa');

  const res = await fetch(`${API_URL}/api/citas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.data || []; 
}

export async function createCita(data: any) {
  const token = Cookies.get('token');
  const res = await fetch(`${API_URL}/api/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  return res.json();
}

// ACTUALIZAR CITA
export async function updateCita(documentId: string, data: any) {
  const token = Cookies.get('token');
  const res = await fetch(`${API_URL}/api/citas/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  return res.json();
}

export async function getPacientes(query: string = '') {
  const token = Cookies.get('token');
  

  const filterQuery = query 
    ? `&filters[$or][0][nombre][$contains]=${query}&filters[$or][1][apellido][$contains]=${query}`
    : '';

  const res = await fetch(`${API_URL}/api/pacientes?sort=createdAt:desc${filterQuery}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return data.data; 
}

export async function getPacienteExpediente(patientDocumentId: string): Promise<Paciente | null> {
  const token = Cookies.get('token');
  
 
  const queryExpediente = new URLSearchParams();
  queryExpediente.append('filters[paciente][documentId][$eq]', patientDocumentId);
  queryExpediente.append('populate[0]', 'resumen_clinicos');
  queryExpediente.append('populate[1]', 'paciente');

  const resExpediente = await fetch(`${API_URL}/api/expedientes?${queryExpediente.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const dataExpediente = await resExpediente.json();
  const expedienteEncontrado = dataExpediente.data && dataExpediente.data.length > 0 ? dataExpediente.data[0] : null;

  if (!expedienteEncontrado) return null;


  const queryCitas = new URLSearchParams();
  queryCitas.append('filters[paciente][documentId][$eq]', patientDocumentId);
  queryCitas.append('sort', 'Fecha:desc');
  queryCitas.append('populate[0]', 'servicio');
  queryCitas.append('populate[1]', 'dentista');

  const resCitas = await fetch(`${API_URL}/api/citas?${queryCitas.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const dataCitas = await resCitas.json();
  const citasEncontradas = dataCitas.data || [];

  const pacienteCompleto: Paciente = {
    ...expedienteEncontrado.paciente, 
    
    citas: citasEncontradas, 

    expediente: {
        id: expedienteEncontrado.id,
        documentId: expedienteEncontrado.documentId,
        estado: expedienteEncontrado.estado,
        Fecha_Creacion: expedienteEncontrado.Fecha_Creacion,
        resumen_clinicos: expedienteEncontrado.resumen_clinicos || [] 
    }
  };

  return pacienteCompleto;
}

export async function savePaciente(data: any, documentId?: string) {
  const token = Cookies.get('token');
  const method = documentId ? 'PUT' : 'POST';
  const endpoint = documentId ? `/api/pacientes/${documentId}` : '/api/pacientes';

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  
  const responseData = await res.json();

  if (!documentId && responseData.data) {
    const newPatientId = responseData.data.documentId;
    await fetch(`${API_URL}/api/expedientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          Fecha_Creacion: new Date().toISOString().split('T')[0],
          estado: 'Activo',
          paciente: newPatientId, 
        }
      })
    });
  }

  return responseData;
}

export async function createNotaClinica(notaData: any, expedienteDocumentId: string) {
  const token = Cookies.get('token');
  

  const datosStrapi = {
    Fecha: notaData.Fecha,
    Hora: notaData.Hora + ':00.000', 
    Descripcion: notaData.Descripcion,
    Tratamiento: notaData.Tratamiento,
    Seguimiento: notaData.Seguimiento,

    expediente: expedienteDocumentId
  };

  const res = await fetch(`${API_URL}/api/resumen-clinicos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: datosStrapi }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(" ERROR AL CREAR NOTA:", data);
    throw new Error(data.error?.message || "Error al guardar la nota");
  }

  return data;
}

export async function getDentistas() {
  const token = Cookies.get('token');
  try {
    const res = await fetch(`${API_URL}/api/dentistas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error obteniendo dentistas:", error);
    return [];
  }
}