import React, { useEffect, useState } from 'react'
import { store } from '../firebaseconfig'

const Ranking = () => {
    const [leads, setLeads] = useState(undefined)
    const [stats, setStats] = useState(undefined)

    const removeDuplicates = leadsArray => {
        let filtered = []
        let names = []
        for(let lead of leadsArray){
            if(!names.includes(lead.name)){
                names.push(lead.name)
                filtered.push(lead)
            }
        }
        return filtered
    }


    const sortPeopleByAmount = persons => {
        let sorted = []
        // let's find the maximum number of calls made by a salesman
        let current_number = 0
        for(let person of persons){
            if(person.messages_sent >= current_number){
                sorted.unshift(person)
                current_number = person.messages_sent
            } else {
                sorted.push(person)  
            }
        }

        return sorted
    } 

    const getScore = () => {
        let salespersons = []
        for(let person of salesperson_codes){
            let persn = {
                code: person,
                name: salesperson[person],
                messages_sent: 0,
            }
            const filtered_by_person = leads.filter( lead => lead.salesman === person)
            persn.messages_sent = filtered_by_person.length
            salespersons.push(persn)
        }
        const sorted_salespersons = sortPeopleByAmount(salespersons)
        setStats(sorted_salespersons)
    }

    useEffect(() => {

        const getLeads = async () => {
            try{
                const { docs } = await store.collection('leads').get()
                const leadsArray = docs.map( item => ({id:item.id, ...item.data()}))
                const uniqueValues = removeDuplicates(leadsArray)
                setLeads(uniqueValues)
            } catch (e){
                alert(e)
            }
        }

        getLeads()
    }, [])

    const salesperson = {
        'SYCC': 'Sandra',
        'CMGC': 'Cinthya',
        'AOJG': 'Alan',
        'LGHB': 'Luis Gerardo',
        'HAVT': 'Hector',
        'JAR': 'Javier',
        'SCA': 'Sol Campos',
        'EGGM': 'Eduardo',
        'GIMN': 'Gabriel',
        'MACG': 'Martha',
        'ASU': 'Antonio',
        'JGBM': 'Jonathan',
        'JRUG': 'Rafael',
        'DABL': 'David'
    }

    const salesperson_codes = ['SYCC', 'CMGC', 'AOJG', 'LGHB', 'HAVT', 'JAR', 'SCA', 'EGGM', 'GIMN', 'MACG', 'ASU', 'JGBM', 'JRUG', 'DABL']

    return (
        <div className='ranking'>
                <section className='ranking-header'>
                    <h2>RANKING</h2>
                </section>
                <section className='ranking-body'>
                    {
                        leads?
                        (
                            <div className='ranking-container'>
                                {
                                    stats?
                                    (
                                        stats.map( person => (
                                            <div className='ranking-row' key={person.code}>
                                                <div>
                                                    {person.name}
                                                </div>
                                                <div>
                                                    {person.messages_sent}
                                                </div>
                                            </div>
                                        ))
                                    )
                                    :
                                    (
                                        <div className='ranking-button-container'>
                                            <button
                                                onClick={ e => getScore()}
                                            >
                                                Cargar Ranking
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        )
                        :
                        (
                            <div className='loader'>
                                <p>Cargando Leads...</p>
                            </div>
                        )
                    }
                </section>
        </div>
    )
}

export default Ranking
