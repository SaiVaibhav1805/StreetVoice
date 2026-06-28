const icons = {
    pothole: '🕳️',
    water_leakage: '💧',
    streetlight: '💡',
    garbage: '🗑️',
    sewage: '🚧',
    road_damage: '🛣️',
    encroachment: '🏗️',
    other: '📌',
}

export default function CategoryIcon({ category, size = '1.5rem' }) {
    return (
        <span style={{ fontSize: size }}>
            {icons[category] || '📌'}
        </span>
    )
}