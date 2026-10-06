package com.example.pasajero.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.pasajero.R
import com.example.pasajero.model.Colectivo

class ColectivoAdapter(
    private var items: MutableList<Colectivo>,
    private val onClick: (Colectivo) -> Unit
) : RecyclerView.Adapter<ColectivoAdapter.ColectivoViewHolder>() {

    fun actualizarLista(nuevaLista: List<Colectivo>) {
        items = nuevaLista.toMutableList()
        notifyDataSetChanged()
    }

    fun actualizarColectivo(id: String, nuevosAsientos: Int) {
        val index = items.indexOfFirst { it.id == id }
        if (index != -1) {
            items[index].asientosDisponibles = nuevosAsientos
            notifyItemChanged(index)
        }
    }

    class ColectivoViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val badge: TextView = view.findViewById(R.id.tvBadge)
        val titulo: TextView = view.findViewById(R.id.tvTitulo)
        val asientos: TextView = view.findViewById(R.id.tvAsientos)
        val eta: TextView = view.findViewById(R.id.tvEta)
        val tarifa: TextView = view.findViewById(R.id.tvTarifa)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ColectivoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_colectivo, parent, false)
        return ColectivoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ColectivoViewHolder, position: Int) {
        val c = items[position]
        holder.badge.text = "L${c.linea.filter { it.isDigit() }}"
        holder.titulo.text = "${c.linea} · ${c.destino}"
        holder.asientos.text = if (c.asientosDisponibles > 0)
            "${c.asientosDisponibles} asientos libres" else "Sin asientos"
        holder.eta.text = "${c.etaMinutos} min"
        holder.tarifa.text = "$${c.tarifa}"
        holder.itemView.setOnClickListener { onClick(c) }
    }

    override fun getItemCount(): Int = items.size
}