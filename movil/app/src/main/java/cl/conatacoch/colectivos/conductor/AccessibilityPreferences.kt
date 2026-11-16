package cl.conatacoch.colectivos.conductor

import android.app.Activity
import android.content.Context
import android.util.TypedValue
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import cl.conatacoch.colectivos.R

enum class TextScale(val preferenceValue: String, val multiplier: Float, val label: String) {
    NORMAL("normal", 1.0f, "Normal"),
    LARGE("large", 1.2f, "Grande"),
    EXTRA_LARGE("extra_large", 1.4f, "Muy grande");

    companion object {
        fun fromPreference(value: String?): TextScale =
            entries.firstOrNull { it.preferenceValue == value } ?: NORMAL
    }
}

class AccessibilityPreferences(context: Context) {
    private val preferences = context.getSharedPreferences(
        "colectivos_accessibility",
        Context.MODE_PRIVATE
    )

    fun getTextScale(): TextScale =
        TextScale.fromPreference(preferences.getString(KEY_TEXT_SCALE, TextScale.NORMAL.preferenceValue))

    fun setTextScale(scale: TextScale) {
        preferences.edit().putString(KEY_TEXT_SCALE, scale.preferenceValue).apply()
    }

    companion object {
        private const val KEY_TEXT_SCALE = "text_scale"

        fun applyTo(activity: Activity) {
            val scale = AccessibilityPreferences(activity).getTextScale().multiplier
            applyToView(activity.findViewById(android.R.id.content), scale)
        }

        private fun applyToView(view: View, scale: Float) {
            if (view is TextView) {
                val baseSize = view.getTag(R.id.accessibility_base_text_size) as? Float
                    ?: view.textSize.also {
                        view.setTag(R.id.accessibility_base_text_size, it)
                    }
                view.setTextSize(TypedValue.COMPLEX_UNIT_PX, baseSize * scale)
            }
            if (view is ViewGroup) {
                for (index in 0 until view.childCount) {
                    applyToView(view.getChildAt(index), scale)
                }
            }
        }
    }
}
