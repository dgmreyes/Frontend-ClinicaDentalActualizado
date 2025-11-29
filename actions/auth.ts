
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';


export async function login(identifier: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const token = data.jwt;

    const userRes = await fetch(`${API_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const userData = await userRes.json();

    Cookies.set('token', token, { expires: 7 });
   
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getUser() {
  const userCookie = Cookies.get('user');
  if (userCookie) {
    return JSON.parse(userCookie);
  }
  return null;
}

export function getToken() {
  return Cookies.get('token');
}

// Función para cerrar sesión
export function logout() {
  Cookies.remove('token');
  Cookies.remove('user');
  window.location.href = '/signup';
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
export async function registerPatient(formData: any) {
  try {

    const resAuth = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    });

    const dataAuth = await resAuth.json();
    if (dataAuth.error) throw new Error(dataAuth.error.message);

    const token = dataAuth.jwt;
    const user = dataAuth.user;

    const resPaciente = await fetch(`${API_URL}/api/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: Number(formData.telefono), 
          Direccion: formData.Direccion,
        }
      }),
    });

    const dataPaciente = await resPaciente.json();
    
    if (dataPaciente.error) {
      console.error(" Error Detallado Strapi (Paciente):", JSON.stringify(dataPaciente.error, null, 2));
      throw new Error(`Error al crear perfil: ${dataPaciente.error.message}`);
    }

    const newPatientDocId = dataPaciente.data.documentId || dataPaciente.data.id;

    const resLink = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            paciente: newPatientDocId 
        })
    });

    if (!resLink.ok) {
        console.warn(" No se pudo vincular automáticamente. Verifica permisos de update en User.");
    }


    const relationPaciente = dataPaciente.data.documentId ? dataPaciente.data.documentId : { connect: [dataPaciente.data.id] };

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
          paciente: relationPaciente, 
        }
      })
    });
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });

    return dataAuth;

  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
}

