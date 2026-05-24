
import React, { useState } from 'react';

function Devolucion() {
	const [idPedido, setIdPedido] = useState('');
	const [mensaje, setMensaje] = useState('');
	const [cargando, setCargando] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setCargando(true);
		setMensaje('');
		try {
			const res = await fetch('http://localhost:3000/api/devolucion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id_pedido: idPedido }),
			});
			const data = await res.json();
			setMensaje(data.mensaje || data.error || 'Sin respuesta');
		} catch (err) {
			setMensaje('Error de conexión con el servidor');
		}
		setCargando(false);
	};

	return (
		<div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
			<h2>Solicitar Devolución</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="idPedido">ID del Pedido:</label>
				<input
					id="idPedido"
					type="text"
					value={idPedido}
					onChange={e => setIdPedido(e.target.value)}
					required
					style={{ width: '100%', marginBottom: 12, padding: 8 }}
				/>
				<button type="submit" disabled={cargando} style={{ width: '100%', padding: 10 }}>
					{cargando ? 'Enviando...' : 'Procesar Devolución'}
				</button>
			</form>
			{mensaje && (
				<div style={{ marginTop: 20, padding: 10, background: '#f5f5f5', borderRadius: 4 }}>
					{mensaje}
				</div>
			)}
		</div>
	);
}

export default Devolucion;
