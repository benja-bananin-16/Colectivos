package com.example.pasajero.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.View
import com.example.pasajero.model.Colectivo

class RouteMapView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null
) : View(context, attrs) {

    private var colectivos: List<Colectivo> = emptyList()

    private val bgPaint = Paint().apply { color = Color.parseColor("#141414") }
    private val gridPaint = Paint().apply { color = Color.parseColor("#232323"); strokeWidth = 2f }
    private val routePaint = Paint().apply {
        color = Color.parseColor("#FFD100")
        style = Paint.Style.STROKE
        strokeWidth = 8f
        strokeCap = Paint.Cap.ROUND
        isAntiAlias = true
    }
    private val markerPaint = Paint().apply { color = Color.parseColor("#FFD100"); isAntiAlias = true }
    private val markerTextPaint = Paint().apply {
        color = Color.parseColor("#111111")
        textSize = 28f
        textAlign = Paint.Align.CENTER
        isFakeBoldText = true
        isAntiAlias = true
    }
    private val startPaint = Paint().apply { color = Color.parseColor("#FFD100") }
    private val endPaint = Paint().apply { color = Color.WHITE }

    fun setColectivos(lista: List<Colectivo>) {
        colectivos = lista
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val w = width.toFloat()
        val h = height.toFloat()

        canvas.drawRect(0f, 0f, w, h, bgPaint)

        val rows = 5
        val cols = 4
        for (i in 1 until rows) canvas.drawLine(0f, h / rows * i, w, h / rows * i, gridPaint)
        for (i in 1 until cols) canvas.drawLine(w / cols * i, 0f, w / cols * i, h, gridPaint)

        val start = PointF(w * 0.07f, h * 0.87f)
        val end = PointF(w * 0.88f, h * 0.1f)
        val path = Path().apply {
            moveTo(start.x, start.y)
            cubicTo(w * 0.2f, h * 0.73f, w * 0.4f, h * 0.5f, w * 0.68f, h * 0.21f)
            cubicTo(w * 0.75f, h * 0.17f, w * 0.8f, h * 0.13f, end.x, end.y)
        }
        canvas.drawPath(path, routePaint)
        canvas.drawCircle(start.x, start.y, 14f, startPaint)
        canvas.drawCircle(end.x, end.y, 14f, endPaint)

        colectivos.forEach { c ->
            val cx = w * c.puntoRutaX
            val cy = h * c.puntoRutaY
            canvas.drawCircle(cx, cy, 34f, markerPaint)
            val numero = c.linea.filter { it.isDigit() }
            canvas.drawText(numero, cx, cy + 10f, markerTextPaint)
        }
    }

    private data class PointF(val x: Float, val y: Float)
}