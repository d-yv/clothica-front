import styles from './Style.module.css';


export default function Style() {
  const advantages = [
    {
      icon: '/images/Style/Heading-0-x1.png', 
      title: 'Якість та натуральність',
      description: 'тільки приємні до тіла тканини, які зберігають форму навіть після десятків прань'
    },
    {
      icon: '/images/Style/Heading-1-x1.png', 
      title: 'Універсальний дизайн',
      description: 'базові кольори та лаконічний стиль, що легко комбінуються між собою.'
    },
    {
      icon: '/images/Style/Heading-2-x1.png', 
      title: 'Комфорт на кожен день', 
      description: 'одяг, який не обмежує рухів і підходить для будь-якої ситуації.'
    }
  ];

  return (
    <section className={styles.style}>
      <div className={styles.container}>
        <h2 className={styles.title}>Обери свій унікальний стиль сьогодні</h2>
        <ul className={styles.advantagesList}>
          {advantages.map((advantage, index) => (
            <li key={index} className={styles.advantageItem}>
              <div className={styles.iconContainer}>
                <img 
                  src={advantage.icon} 
                  alt={advantage.title}
                  className={styles.icon}
                />
              </div>
              <h3 className={styles.advantageTitle}>{advantage.title}</h3>
              <p className={styles.advantageDescription}>{advantage.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}