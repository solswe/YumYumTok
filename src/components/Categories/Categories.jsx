import styles from './Categories.module.css';
import Link from 'next/link';


export default function Categories({ categories}) {

  return (
    <div className={styles.restaurants}>
      {categories.map((value, index) => (
        <Link key={index} href={`/search/${value}`}>
            <div className="box has-text-success is-size-4">
              {value}
            </div>
        </Link>
      ))}
    </div>

  );
}